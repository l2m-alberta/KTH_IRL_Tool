/**
 * KTH Innovation Readiness Level (IRL)™ Intake, Assessment & Database UI
 *
 * Reads all framework content from window.KTH_IRL_DATA (data.js).
 * Persists submitted assessments to the local SQLite database via /api/submissions.
 */

(function () {
  "use strict";

  const DATA = window.KTH_IRL_DATA;
  const STORAGE_KEY = "kth_irl_intake_draft_v2";
  const ADMIN_SESSION_KEY = "kth_irl_admin_pw_v1";

  const LEVEL_BAND_LABELS = {
    1: "Early",
    2: "Early",
    3: "Early",
    4: "Developing",
    5: "Developing",
    6: "Developing",
    7: "Maturing",
    8: "Maturing",
    9: "Maturing"
  };

  const state = {
    activeDimIndex: 0,
    scores: {}, // { CRL: 8, ... }
    intake: {
      fullName: "",
      email: "",
      academicInstitution: "",
      ventureWebsite: "",
      ventureDetails: ""
    },
    compareAdjacent: true,
    showAllLevels: false,
    view: "assessment", // "assessment" | "results" | "database"
    expandAllCriteria: false,
    resultsContext: {
      mode: "assessment", // "assessment" | "sample" | "saved"
      savedId: null,
      createdAt: null,
      intake: null,
      scores: null
    },
    submissions: [],
    adminPassword: ""
  };

  // DOM References
  const els = {
    assessmentView: document.getElementById("assessment-view"),
    resultsView: document.getElementById("results-view"),
    databaseView: document.getElementById("database-view"),

    navAssessment: document.getElementById("nav-assessment"),
    navDatabase: document.getElementById("nav-database"),
    dbCountBadge: document.getElementById("db-count-badge"),

    fullNameInput: document.getElementById("full-name"),
    emailInput: document.getElementById("email-address"),
    institutionInput: document.getElementById("academic-institution"),
    websiteInput: document.getElementById("venture-website"),
    ventureDetailsInput: document.getElementById("venture-details"),

    progressCount: document.getElementById("progress-count"),
    progressBar: document.getElementById("progress-bar"),
    progressFill: document.getElementById("progress-fill"),
    dimensionTabs: document.getElementById("dimension-tabs"),
    dimAcronymBadge: document.getElementById("dim-acronym-badge"),
    dimVersion: document.getElementById("dim-version"),
    dimTitle: document.getElementById("dim-title"),
    dimGoal: document.getElementById("dim-goal"),
    dimDefNote: document.getElementById("dim-definition-note"),
    levelRadiogroup: document.getElementById("level-radiogroup"),
    levelDetailsContainer: document.getElementById("level-details-container"),
    allLevelsPanel: document.getElementById("all-levels-panel"),
    allLevelsList: document.getElementById("all-levels-list"),
    formValidationMsg: document.getElementById("form-validation-msg"),

    btnToggleCompare: document.getElementById("btn-toggle-compare"),
    btnToggleAllLevels: document.getElementById("btn-toggle-all-levels"),
    btnPrevDim: document.getElementById("btn-prev-dim"),
    btnNextDim: document.getElementById("btn-next-dim"),
    btnViewResults: document.getElementById("btn-view-results"),
    btnLoadSample: document.getElementById("btn-load-sample"),
    btnRestartTop: document.getElementById("btn-restart-top"),

    saveConfirmationBanner: document.getElementById("save-confirmation-banner"),
    resultsIntakeSummary: document.getElementById("results-intake-summary"),
    btnEditAnswers: document.getElementById("btn-edit-answers"),
    btnViewDatabaseFromResults: document.getElementById("btn-view-database-from-results"),
    btnDownloadPng: document.getElementById("btn-download-png"),
    btnPrint: document.getElementById("btn-print"),
    btnRestartResults: document.getElementById("btn-restart-results"),
    btnToggleAllCriteria: document.getElementById("btn-toggle-all-criteria"),
    resultsTitle: document.getElementById("results-title"),
    resultsSubtitle: document.getElementById("results-subtitle"),
    radarSubmittedDate: document.getElementById("radar-submitted-date"),
    balanceSubmittedDate: document.getElementById("balance-submitted-date"),
    radarChartWrapper: document.getElementById("radar-chart-wrapper"),
    balanceMetrics: document.getElementById("balance-metrics"),
    dimensionBars: document.getElementById("dimension-bars"),
    imbalanceCards: document.getElementById("imbalance-cards"),
    resultsSummaryList: document.getElementById("results-summary-list"),

    dbLockScreen: document.getElementById("db-lock-screen"),
    dbUnlockForm: document.getElementById("db-unlock-form"),
    dbAdminPassword: document.getElementById("db-admin-password"),
    dbAuthError: document.getElementById("db-auth-error"),
    dbUnlockedPanel: document.getElementById("db-unlocked-panel"),
    dbStatsStrip: document.getElementById("db-stats-strip"),
    dbSearch: document.getElementById("db-search"),
    dbContent: document.getElementById("db-content"),
    btnRefreshDb: document.getElementById("btn-refresh-db"),
    btnExportCsv: document.getElementById("btn-export-csv"),
    btnLockDb: document.getElementById("btn-lock-db"),
    btnNewFromDb: document.getElementById("btn-new-from-db")
  };

  /* ------------------------------------------------------------------------
     Draft Persistence (localStorage)
     ------------------------------------------------------------------------ */
  function saveDraft() {
    try {
      const payload = {
        scores: state.scores,
        intake: state.intake,
        activeDimIndex: state.activeDimIndex
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_err) {
      // Ignore storage errors
    }
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (parsed.scores && typeof parsed.scores === "object") {
          DATA.dimensions.forEach((dim) => {
            const val = Number(parsed.scores[dim.id]);
            if (Number.isInteger(val) && val >= 1 && val <= 9) {
              state.scores[dim.id] = val;
            }
          });
        }
        if (parsed.intake && typeof parsed.intake === "object") {
          state.intake = {
            fullName: String(parsed.intake.fullName || ""),
            email: String(parsed.intake.email || ""),
            academicInstitution: String(parsed.intake.academicInstitution || ""),
            ventureWebsite: String(parsed.intake.ventureWebsite || ""),
            ventureDetails: String(parsed.intake.ventureDetails || "")
          };
        }
        if (
          Number.isInteger(parsed.activeDimIndex) &&
          parsed.activeDimIndex >= 0 &&
          parsed.activeDimIndex < DATA.dimensions.length
        ) {
          state.activeDimIndex = parsed.activeDimIndex;
        }
      }
    } catch (_err) {
      // Ignore parse/storage errors
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_err) {
      // Ignore
    }
  }

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */
  function getActiveDimension() {
    return DATA.dimensions[state.activeDimIndex];
  }

  function getLevelObj(dim, levelNum) {
    return dim.levels.find((l) => l.level === levelNum) || null;
  }

  function getRatedCount() {
    return DATA.dimensions.filter((d) => Number.isInteger(state.scores[d.id])).length;
  }

  function isAllRated() {
    return getRatedCount() === DATA.dimensions.length;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = String(str ?? "");
    return div.innerHTML;
  }

  function normalizeWebsiteUrl(rawUrl) {
    const trimmed = String(rawUrl || "").trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  function formatDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function renderCriteriaMarkup(dim, levelObj) {
    if (!levelObj) return "";
    if (dim.criteriaType === "aspects" && Array.isArray(levelObj.aspects)) {
      const items = levelObj.aspects
        .map(
          (a) =>
            `<li class="aspect-item">
              <span class="aspect-name">${escapeHtml(a.aspect)}</span>
              <span class="aspect-desc">${escapeHtml(a.description)}</span>
            </li>`
        )
        .join("");
      return `<ul class="aspect-list">${items}</ul>`;
    }
    const bullets = (levelObj.criteria || [])
      .map((c) => `<li>${escapeHtml(c)}</li>`)
      .join("");
    return `<ul class="criteria-list">${bullets}</ul>`;
  }

  function syncIntakeInputsFromState() {
    els.fullNameInput.value = state.intake.fullName;
    els.emailInput.value = state.intake.email;
    els.institutionInput.value = state.intake.academicInstitution;
    els.websiteInput.value = state.intake.ventureWebsite;
    els.ventureDetailsInput.value = state.intake.ventureDetails;
  }

  function showValidationError(message) {
    if (!message) {
      els.formValidationMsg.hidden = true;
      els.formValidationMsg.textContent = "";
      return;
    }
    els.formValidationMsg.textContent = message;
    els.formValidationMsg.hidden = false;
  }

  /* ------------------------------------------------------------------------
     API Helpers (Vercel + Supabase / Local SQLite Backend)
     ------------------------------------------------------------------------ */
  function getAdminHeaders() {
    const headers = {};
    if (state.adminPassword) {
      headers["x-admin-password"] = state.adminPassword;
    }
    return headers;
  }

  function loadAdminSession() {
    try {
      const pw = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (pw) state.adminPassword = pw;
    } catch (_err) {
      // Ignore
    }
  }

  function saveAdminSession(pw) {
    state.adminPassword = pw;
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, pw);
    } catch (_err) {
      // Ignore
    }
  }

  function clearAdminSession() {
    state.adminPassword = "";
    state.submissions = [];
    els.dbCountBadge.hidden = true;
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (_err) {
      // Ignore
    }
  }

  async function fetchSubmissions(query = "") {
    const url = query
      ? `/api/submissions?q=${encodeURIComponent(query)}`
      : "/api/submissions";
    const res = await fetch(url, { headers: getAdminHeaders() });
    if (res.status === 401 || res.status === 503) {
      const errData = await res.json().catch(() => ({}));
      const err = new Error(errData.error || "Admin password required.");
      err.status = res.status;
      throw err;
    }
    if (!res.ok) {
      throw new Error("Failed to load submissions from database.");
    }
    const data = await res.json();
    return data.submissions || [];
  }

  async function refreshDatabaseCount() {
    if (!state.adminPassword) {
      els.dbCountBadge.hidden = true;
      return;
    }
    try {
      const list = await fetchSubmissions("");
      state.submissions = list;
      els.dbCountBadge.textContent = String(list.length);
      els.dbCountBadge.hidden = false;
    } catch (_err) {
      els.dbCountBadge.hidden = true;
    }
  }

  async function submitToDatabase() {
    const payload = {
      fullName: state.intake.fullName.trim(),
      email: state.intake.email.trim(),
      academicInstitution: state.intake.academicInstitution.trim(),
      ventureWebsite: normalizeWebsiteUrl(state.intake.ventureWebsite),
      ventureDetails: state.intake.ventureDetails.trim(),
      scores: { ...state.scores }
    };

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.error || "Could not save submission.");
    }
    return body.submission;
  }

  async function deleteSubmission(id) {
    const res = await fetch(`/api/submissions/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });
    if (res.status === 401) {
      clearAdminSession();
      throw new Error("Admin session expired. Please unlock the database again.");
    }
    if (!res.ok) {
      throw new Error("Could not delete submission.");
    }
  }

  /* ------------------------------------------------------------------------
     Assessment View Rendering
     ------------------------------------------------------------------------ */
  function renderProgress() {
    const count = getRatedCount();
    const total = DATA.dimensions.length;
    const pct = Math.round((count / total) * 100);

    els.progressCount.textContent = `${count} of ${total}`;
    els.progressBar.setAttribute("aria-valuenow", String(count));
    els.progressFill.style.width = `${pct}%`;
  }

  function renderDimensionTabs() {
    els.dimensionTabs.innerHTML = DATA.dimensions
      .map((dim, idx) => {
        const isCurrent = idx === state.activeDimIndex;
        const score = state.scores[dim.id];
        const scoreLabel = score ? `${dim.acronym} ${score}` : "Unrated";
        const scoreClass = score ? "dim-tab-score is-rated" : "dim-tab-score";
        return `
          <li>
            <button
              type="button"
              class="dim-tab-btn"
              data-dim-index="${idx}"
              ${isCurrent ? 'aria-current="step"' : ""}
            >
              <span class="dim-tab-top">
                <span class="dim-tab-acronym">${escapeHtml(dim.acronym)}</span>
                <span class="${scoreClass}">${escapeHtml(scoreLabel)}</span>
              </span>
              <span class="dim-tab-name">${escapeHtml(dim.shortName)}</span>
            </button>
          </li>
        `;
      })
      .join("");
  }

  function renderLevelRadiogroup(dim, selectedLevel) {
    const html = dim.levels
      .map((lvl) => {
        const checked = selectedLevel === lvl.level ? "checked" : "";
        const inputId = `radio-${dim.id}-${lvl.level}`;
        return `
          <div class="level-option">
            <input
              type="radio"
              id="${inputId}"
              class="level-radio-input"
              name="level-${dim.id}"
              value="${lvl.level}"
              ${checked}
            >
            <label for="${inputId}" class="level-radio-label lvl-${lvl.level}">
              <span class="level-num">${lvl.level}</span>
              <span class="level-band" aria-hidden="true"></span>
              <span class="level-tag">${LEVEL_BAND_LABELS[lvl.level]}</span>
            </label>
          </div>
        `;
      })
      .join("");

    els.levelRadiogroup.innerHTML = html;
  }

  function renderLevelDetailCard(dim, levelObj, roleLabel, isSelected) {
    const roleText = isSelected ? "Selected Level" : roleLabel;
    const cardClass = isSelected
      ? "level-detail-card is-selected"
      : "level-detail-card is-adjacent";

    const switchBtn = isSelected
      ? ""
      : `<button type="button" class="btn btn-secondary btn-sm switch-level-btn" data-select-level="${levelObj.level}">
           Select Level ${levelObj.level}
         </button>`;

    return `
      <div class="${cardClass}">
        <div class="level-detail-header">
          <span class="level-pill lvl-${levelObj.level}">${escapeHtml(dim.acronym)} ${levelObj.level}</span>
          <span class="level-role-badge">${escapeHtml(roleText)}</span>
        </div>
        <p class="level-summary-text">${escapeHtml(levelObj.summary)}</p>
        <div>
          <h4 class="criteria-heading">${dim.criteriaType === "aspects" ? "Criteria by Aspect" : "Detailed Criteria"}</h4>
          ${renderCriteriaMarkup(dim, levelObj)}
        </div>
        ${switchBtn}
      </div>
    `;
  }

  function renderLevelDetails(dim, selectedLevel) {
    if (!selectedLevel) {
      els.levelDetailsContainer.innerHTML = `
        <div class="empty-selection-prompt">
          <p><strong>No level selected yet for ${escapeHtml(dim.name)}.</strong></p>
          <p>Choose a level from 1 to 9 above—or click <em>View All 9 Levels</em>—to inspect its summary and detailed criteria.</p>
        </div>
      `;
      return;
    }

    const selectedObj = getLevelObj(dim, selectedLevel);
    if (!state.compareAdjacent) {
      els.levelDetailsContainer.innerHTML = `
        <div class="comparison-grid single-view">
          ${renderLevelDetailCard(dim, selectedObj, "Selected Level", true)}
        </div>
      `;
      return;
    }

    const cards = [];
    if (selectedLevel > 1) {
      const prevObj = getLevelObj(dim, selectedLevel - 1);
      cards.push(renderLevelDetailCard(dim, prevObj, `Previous (Level ${selectedLevel - 1})`, false));
    }
    cards.push(renderLevelDetailCard(dim, selectedObj, "Selected Level", true));
    if (selectedLevel < 9) {
      const nextObj = getLevelObj(dim, selectedLevel + 1);
      cards.push(renderLevelDetailCard(dim, nextObj, `Next (Level ${selectedLevel + 1})`, false));
    }

    const gridCols = cards.length === 2 ? "repeat(2, minmax(0, 1fr))" : "";
    els.levelDetailsContainer.innerHTML = `
      <div class="comparison-grid" ${gridCols ? `style="grid-template-columns: ${gridCols}"` : ""}>
        ${cards.join("")}
      </div>
    `;
  }

  function renderAllLevelsPanel(dim, selectedLevel) {
    els.allLevelsPanel.hidden = !state.showAllLevels;
    els.btnToggleAllLevels.setAttribute("aria-expanded", String(state.showAllLevels));
    els.btnToggleAllLevels.textContent = state.showAllLevels
      ? "Hide All 9 Levels"
      : "View All 9 Levels";

    if (!state.showAllLevels) return;

    els.allLevelsList.innerHTML = dim.levels
      .slice()
      .reverse()
      .map((lvl) => {
        const isSel = selectedLevel === lvl.level;
        return `
          <div class="all-level-row ${isSel ? "is-selected" : ""}">
            <span class="level-pill lvl-${lvl.level}">${escapeHtml(dim.acronym)} ${lvl.level}</span>
            <span class="all-level-summary">${escapeHtml(lvl.summary)}</span>
            <button
              type="button"
              class="btn ${isSel ? "btn-primary" : "btn-secondary"} btn-sm"
              data-select-level="${lvl.level}"
            >
              ${isSel ? "Selected" : `Select ${lvl.level}`}
            </button>
          </div>
        `;
      })
      .join("");
  }

  function renderActiveDimension() {
    const dim = getActiveDimension();
    const selectedLevel = state.scores[dim.id] || null;

    els.dimAcronymBadge.textContent = dim.acronym;
    els.dimVersion.textContent = dim.version || "";
    els.dimTitle.textContent = dim.name;
    els.dimGoal.textContent = `Goal: ${dim.goal}`;

    if (dim.definitionNote) {
      els.dimDefNote.textContent = dim.definitionNote;
      els.dimDefNote.hidden = false;
    } else {
      els.dimDefNote.hidden = true;
    }

    els.btnToggleCompare.setAttribute("aria-pressed", String(state.compareAdjacent));
    els.btnPrevDim.disabled = state.activeDimIndex === 0;
    els.btnNextDim.disabled = state.activeDimIndex === DATA.dimensions.length - 1;

    renderDimensionTabs();
    renderLevelRadiogroup(dim, selectedLevel);
    renderLevelDetails(dim, selectedLevel);
    renderAllLevelsPanel(dim, selectedLevel);
    renderProgress();
  }

  /* ------------------------------------------------------------------------
     Results View & SVG Radar Chart
     ------------------------------------------------------------------------ */
  function analyzeScores(scoreMap) {
    const entries = DATA.dimensions.map((dim) => ({
      dim,
      score: scoreMap[dim.id]
    }));

    const values = entries.map((e) => e.score);
    const maxScore = Math.max(...values);
    const minScore = Math.min(...values);
    const spread = maxScore - minScore;
    const avg = values.reduce((acc, v) => acc + v, 0) / values.length;

    const strongest = entries.filter((e) => e.score === maxScore);
    const weakest = entries.filter((e) => e.score === minScore);

    return { entries, maxScore, minScore, spread, avg, strongest, weakest };
  }

  function buildRadarSvg(analysis) {
    const cx = 300;
    const cy = 270;
    const maxR = 165;
    const labelR = 204;
    const count = DATA.dimensions.length;

    const angles = DATA.dimensions.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / count);

    const ringsSvg = [];
    for (let lvl = 1; lvl <= 9; lvl++) {
      const r = (lvl / 9) * maxR;
      const isMajor = lvl === 3 || lvl === 6 || lvl === 9;
      ringsSvg.push(
        `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(2)}" fill="none" stroke="${isMajor ? "#64748b" : "#94a3b8"}" stroke-width="${isMajor ? "1.3" : "1"}" stroke-dasharray="${isMajor ? "3,3" : "2,4"}" />`
      );
      ringsSvg.push(
        `<text x="${cx + 5}" y="${(cy - r + 3.5).toFixed(2)}" font-size="10" font-weight="700" fill="#475569" font-family="sans-serif">${lvl}</text>`
      );
    }

    const axesSvg = angles
      .map((angle) => {
        const x2 = cx + Math.cos(angle) * (maxR + 16);
        const y2 = cy + Math.sin(angle) * (maxR + 16);
        return `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" />`;
      })
      .join("");

    const points = analysis.entries.map((entry, i) => {
      const r = (entry.score / 9) * maxR;
      const x = cx + Math.cos(angles[i]) * r;
      const y = cy + Math.sin(angles[i]) * r;
      return { x, y, entry, angle: angles[i] };
    });

    const pointsAttr = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

    const markersSvg = points
      .map((p) => {
        const isStrongest = p.entry.score === analysis.maxScore && analysis.spread > 0;
        const isWeakest = p.entry.score === analysis.minScore && analysis.spread > 0;
        const px = p.x.toFixed(2);
        const py = p.y.toFixed(2);

        if (isStrongest) {
          return `
            <g>
              <circle cx="${px}" cy="${py}" r="10" fill="none" stroke="#14532d" stroke-width="2" />
              <polygon points="${px},${(p.y - 6.5).toFixed(2)} ${(p.x + 6.5).toFixed(2)},${py} ${px},${(p.y + 6.5).toFixed(2)} ${(p.x - 6.5).toFixed(2)},${py}" fill="#15803d" stroke="#ffffff" stroke-width="1.5" />
            </g>
          `;
        }
        if (isWeakest) {
          return `
            <g>
              <circle cx="${px}" cy="${py}" r="10" fill="none" stroke="#7c2d12" stroke-width="1.8" stroke-dasharray="3,2" />
              <rect x="${(p.x - 5).toFixed(2)}" y="${(p.y - 5).toFixed(2)}" width="10" height="10" rx="1.5" fill="#c2410c" stroke="#ffffff" stroke-width="1.5" />
            </g>
          `;
        }
        return `<circle cx="${px}" cy="${py}" r="5.5" fill="#003366" stroke="#ffffff" stroke-width="2" />`;
      })
      .join("");

    const labelsSvg = points
      .map((p, i) => {
        const cos = Math.cos(p.angle);
        const sin = Math.sin(p.angle);
        let lx = cx + cos * labelR;
        let ly = cy + sin * labelR;
        let anchor = "middle";

        if (cos > 0.35) {
          anchor = "start";
          lx -= 8;
        } else if (cos < -0.35) {
          anchor = "end";
          lx += 8;
        }

        if (i === 0) ly -= 6;
        if (i === 3) ly += 12;

        const isStrongest = p.entry.score === analysis.maxScore && analysis.spread > 0;
        const isWeakest = p.entry.score === analysis.minScore && analysis.spread > 0;
        const tag = isStrongest ? " ★" : isWeakest ? " ▲" : "";

        return `
          <g font-family="sans-serif">
            <text x="${lx.toFixed(1)}" y="${(ly - 6).toFixed(1)}" text-anchor="${anchor}" font-size="13" font-weight="800" fill="#141d2b">
              ${escapeHtml(p.entry.dim.shortName.toUpperCase())} (${escapeHtml(p.entry.dim.acronym)})
            </text>
            <text x="${lx.toFixed(1)}" y="${(ly + 11).toFixed(1)}" text-anchor="${anchor}" font-size="12" font-weight="700" fill="#003366">
              Level ${p.entry.score} / 9${tag}
            </text>
          </g>
        `;
      })
      .join("");

    const descSummary = analysis.entries
      .map((e) => `${e.dim.acronym} ${e.score}`)
      .join(", ");

    return `
      <svg id="irl-radar-svg" viewBox="0 0 600 540" role="img" aria-labelledby="radar-svg-title radar-svg-desc" xmlns="http://www.w3.org/2000/svg">
        <title id="radar-svg-title">KTH Innovation Readiness Level Six-Axis Radar Chart</title>
        <desc id="radar-svg-desc">Readiness scores on a 1 to 9 scale: ${escapeHtml(descSummary)}.</desc>
        <defs>
          <radialGradient id="irlRadarGrad" cx="${cx}" cy="${cy}" r="${maxR}" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#d93829" stop-opacity="0.88" />
            <stop offset="32%" stop-color="#f59e0b" stop-opacity="0.82" />
            <stop offset="62%" stop-color="#eab308" stop-opacity="0.78" />
            <stop offset="100%" stop-color="#4caf50" stop-opacity="0.82" />
          </radialGradient>
          <clipPath id="irlPolygonClip">
            <polygon points="${pointsAttr}" />
          </clipPath>
        </defs>

        ${ringsSvg.join("")}
        ${axesSvg}

        <circle cx="${cx}" cy="${cy}" r="${maxR}" fill="url(#irlRadarGrad)" clip-path="url(#irlPolygonClip)" />
        <polygon points="${pointsAttr}" fill="none" stroke="#141d2b" stroke-width="2.5" stroke-linejoin="round" />

        <text x="${cx}" y="${cy - 3}" text-anchor="middle" font-size="8" font-weight="800" fill="#141d2b" font-family="sans-serif" opacity="0.85">KTH INNOVATION</text>
        <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="8" font-weight="800" fill="#141d2b" font-family="sans-serif" opacity="0.85">READINESS LEVEL™</text>

        ${markersSvg}
        ${labelsSvg}
      </svg>
    `;
  }

  function renderResults() {
    const ctx = state.resultsContext;
    const activeScores = ctx.scores || state.scores;
    const intake = ctx.intake;
    const analysis = analyzeScores(activeScores);

    if (ctx.mode === "sample") {
      els.saveConfirmationBanner.hidden = true;
      els.resultsTitle.textContent = "PDF Sample Profile — Readiness Profile";
      els.resultsSubtitle.textContent = "Sample scores from the KTH IRL PDF (not saved to database)";
      els.radarSubmittedDate.hidden = true;
      els.balanceSubmittedDate.hidden = true;
      els.resultsIntakeSummary.hidden = true;
      els.btnEditAnswers.hidden = false;
    } else {
      const displayName = intake && intake.fullName ? `${intake.fullName} — Readiness Profile` : "Innovation Readiness Profile";
      els.resultsTitle.textContent = displayName;
      const dateStr = ctx.createdAt ? formatDate(ctx.createdAt) : formatDate(new Date().toISOString());
      els.resultsSubtitle.textContent = `Submitted ${dateStr} · KTH Innovation Readiness Level™ (Scale 1–9)`;
      els.radarSubmittedDate.textContent = `Submitted: ${dateStr}`;
      els.radarSubmittedDate.hidden = false;
      els.balanceSubmittedDate.textContent = `Submitted: ${dateStr}`;
      els.balanceSubmittedDate.hidden = false;

      if (ctx.savedId) {
        els.saveConfirmationBanner.innerHTML = `
          <span>Saved to local database (Record #${ctx.savedId}). You can review this submission anytime in the Submissions Database.</span>
        `;
        els.saveConfirmationBanner.hidden = false;
      } else {
        els.saveConfirmationBanner.hidden = true;
      }

      if (intake) {
        const websiteHtml = intake.ventureWebsite
          ? `<a href="${escapeHtml(intake.ventureWebsite)}" target="_blank" rel="noopener noreferrer">${escapeHtml(intake.ventureWebsite)}</a>`
          : `<span class="optional-tag">Not provided</span>`;

        els.resultsIntakeSummary.innerHTML = `
          <div class="results-intake-grid">
            <div>
              <span class="intake-meta-label">Name</span>
              <span class="intake-meta-value">${escapeHtml(intake.fullName)}</span>
            </div>
            <div>
              <span class="intake-meta-label">Email Address</span>
              <span class="intake-meta-value"><a href="mailto:${escapeHtml(intake.email)}">${escapeHtml(intake.email)}</a></span>
            </div>
            <div>
              <span class="intake-meta-label">Academic Institution</span>
              <span class="intake-meta-value">${escapeHtml(intake.academicInstitution)}</span>
            </div>
            <div>
              <span class="intake-meta-label">Venture Website</span>
              <span class="intake-meta-value">${websiteHtml}</span>
            </div>
            <div class="results-intake-item-full">
              <span class="intake-meta-label">Venture Details</span>
              <span class="intake-meta-value">${escapeHtml(intake.ventureDetails)}</span>
            </div>
          </div>
        `;
        els.resultsIntakeSummary.hidden = false;
      } else {
        els.resultsIntakeSummary.hidden = true;
      }

      els.btnEditAnswers.hidden = ctx.mode === "saved";
    }

    els.radarChartWrapper.innerHTML = buildRadarSvg(analysis);

    const balanceLabel =
      analysis.spread === 0
        ? "Uniform"
        : analysis.spread <= 2
          ? "Well balanced"
          : analysis.spread <= 4
            ? "Moderate gap"
            : "High imbalance";

    els.balanceMetrics.innerHTML = `
      <div class="metric-box">
        <span class="metric-label">Readiness Gap</span>
        <span class="metric-value">${analysis.spread} level${analysis.spread === 1 ? "" : "s"}</span>
      </div>
      <div class="metric-box">
        <span class="metric-label">Profile Balance</span>
        <span class="metric-value">${balanceLabel}</span>
      </div>
    `;

    els.dimensionBars.innerHTML = analysis.entries
      .map((e) => {
        const pct = Math.round((e.score / 9) * 100);
        const isStrong = e.score === analysis.maxScore && analysis.spread > 0;
        const isWeak = e.score === analysis.minScore && analysis.spread > 0;
        const fillCls = isStrong
          ? "bar-fill is-strongest"
          : isWeak
            ? "bar-fill is-weakest"
            : "bar-fill";
        const tag = isStrong ? " (Highest)" : isWeak ? " (Lowest)" : "";

        return `
          <div class="bar-row">
            <span class="bar-label">${escapeHtml(e.dim.acronym)}</span>
            <div class="bar-track" aria-hidden="true">
              <div class="${fillCls}" style="width: ${pct}%"></div>
            </div>
            <span class="bar-score">${e.score} / 9<span class="sr-only">${tag}</span></span>
          </div>
        `;
      })
      .join("");

    if (analysis.spread === 0) {
      els.imbalanceCards.innerHTML = `
        <div class="insight-card is-balanced">
          <h4 class="insight-title">Balanced Profile (All Dimensions at Level ${analysis.maxScore})</h4>
          <p class="insight-item-summary">
            All six readiness dimensions are currently at Level ${analysis.maxScore}. There is no single bottleneck dimension relative to the others.
          </p>
        </div>
      `;
    } else {
      const strongItems = analysis.strongest
        .map((e) => {
          const lvl = getLevelObj(e.dim, e.score);
          return `
            <li>
              <div class="insight-item-title">${escapeHtml(e.dim.name)} (${escapeHtml(e.dim.acronym)} ${e.score})</div>
              <p class="insight-item-summary">${escapeHtml(lvl.summary)}</p>
            </li>
          `;
        })
        .join("");

      const weakItems = analysis.weakest
        .map((e) => {
          const lvl = getLevelObj(e.dim, e.score);
          const nextLvl = e.score < 9 ? getLevelObj(e.dim, e.score + 1) : null;
          const nextStepHtml = nextLvl
            ? `<p class="insight-next-step"><strong>Next milestone (${escapeHtml(e.dim.acronym)} ${nextLvl.level}):</strong> ${escapeHtml(nextLvl.summary)}</p>`
            : "";
          return `
            <li>
              <div class="insight-item-title">${escapeHtml(e.dim.name)} (${escapeHtml(e.dim.acronym)} ${e.score})</div>
              <p class="insight-item-summary">${escapeHtml(lvl.summary)}</p>
              ${nextStepHtml}
            </li>
          `;
        })
        .join("");

      els.imbalanceCards.innerHTML = `
        <div class="insight-card is-strongest">
          <h4 class="insight-title">Strongest Dimension${analysis.strongest.length > 1 ? "s" : ""} (Level ${analysis.maxScore})</h4>
          <ul class="insight-list">${strongItems}</ul>
        </div>
        <div class="insight-card is-weakest">
          <h4 class="insight-title">Lowest Dimension${analysis.weakest.length > 1 ? "s" : ""} — Priority Focus (Level ${analysis.minScore})</h4>
          <ul class="insight-list">${weakItems}</ul>
        </div>
      `;
    }

    els.resultsSummaryList.innerHTML = analysis.entries
      .map((e) => {
        const lvl = getLevelObj(e.dim, e.score);
        return `
          <article class="summary-dim-card">
            <div class="summary-dim-header">
              <h4 class="summary-dim-title">${escapeHtml(e.dim.name)} (${escapeHtml(e.dim.acronym)})</h4>
              <span class="level-pill lvl-${e.score}">Level ${e.score} / 9</span>
            </div>
            <p class="summary-dim-text">${escapeHtml(lvl.summary)}</p>
            <details class="summary-details" ${state.expandAllCriteria ? "open" : ""}>
              <summary>Show detailed criteria for ${escapeHtml(e.dim.acronym)} ${e.score}</summary>
              ${renderCriteriaMarkup(e.dim, lvl)}
            </details>
          </article>
        `;
      })
      .join("");
  }

  /* ------------------------------------------------------------------------
     Submissions Database View
     ------------------------------------------------------------------------ */
  function setDatabaseLockState(isUnlocked) {
    els.dbLockScreen.hidden = isUnlocked;
    els.dbUnlockedPanel.hidden = !isUnlocked;
    els.btnExportCsv.hidden = !isUnlocked;
    els.btnLockDb.hidden = !isUnlocked;
    if (!isUnlocked) {
      els.dbCountBadge.hidden = true;
    }
  }

  async function renderDatabaseView() {
    if (!state.adminPassword) {
      setDatabaseLockState(false);
      els.dbAuthError.hidden = true;
      return;
    }

    setDatabaseLockState(true);
    const query = (els.dbSearch.value || "").trim();
    els.dbContent.innerHTML = `<div class="db-empty-state">Loading submissions...</div>`;

    try {
      const submissions = await fetchSubmissions(query);
      if (!query) {
        state.submissions = submissions;
        els.dbCountBadge.textContent = String(submissions.length);
        els.dbCountBadge.hidden = false;
      }

      renderDbStats(submissions);

      if (submissions.length === 0) {
        els.dbContent.innerHTML = query
          ? `<div class="db-empty-state">No submissions matched "<strong>${escapeHtml(query)}</strong>".</div>`
          : `<div class="db-empty-state">No submissions saved yet. Complete the Intake &amp; Assessment form to save the first record.</div>`;
        return;
      }

      const rowsHtml = submissions
        .map((sub) => {
          const chips = DATA.dimensions
            .map((dim) => {
              const s = sub.scores[dim.id];
              return `<span class="db-score-chip lvl-${s}">${escapeHtml(dim.acronym)} ${s}</span>`;
            })
            .join("");

          const websiteHtml = sub.ventureWebsite
            ? `<a class="db-venture-link" href="${escapeHtml(sub.ventureWebsite)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sub.ventureWebsite)}</a>`
            : "";

          return `
            <tr>
              <td>
                <div class="db-person-name">#${sub.id}</div>
                <div class="db-person-email">${escapeHtml(formatDate(sub.createdAt))}</div>
              </td>
              <td>
                <div class="db-person-name">${escapeHtml(sub.fullName)}</div>
                <div class="db-person-email"><a href="mailto:${escapeHtml(sub.email)}">${escapeHtml(sub.email)}</a></div>
              </td>
              <td>${escapeHtml(sub.academicInstitution)}</td>
              <td>
                <div class="db-venture-text" title="${escapeHtml(sub.ventureDetails)}">${escapeHtml(sub.ventureDetails)}</div>
                ${websiteHtml}
              </td>
              <td>
                <div class="db-score-chips">${chips}</div>
              </td>
              <td>
                <strong>${sub.average.toFixed(1)}</strong> / 9<br>
                <span class="db-person-email">Gap: ${sub.spread}</span>
              </td>
              <td>
                <div class="db-row-actions">
                  <button type="button" class="btn btn-primary btn-sm" data-view-sub="${sub.id}">View Profile</button>
                  <button type="button" class="btn btn-ghost btn-sm" data-delete-sub="${sub.id}" aria-label="Delete submission #${sub.id}">Delete</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");

      els.dbContent.innerHTML = `
        <div class="db-table-wrapper">
          <table class="db-table">
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Contact</th>
                <th>Academic Institution</th>
                <th>Venture Details &amp; Website</th>
                <th>IRL Scores</th>
                <th>Avg / Gap</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      if (err.status === 401 || err.status === 503) {
        clearAdminSession();
        setDatabaseLockState(false);
        els.dbAuthError.textContent = err.message;
        els.dbAuthError.hidden = false;
        return;
      }
      els.dbContent.innerHTML = `<div class="db-empty-state">${escapeHtml(err.message)}</div>`;
    }
  }

  function renderDbStats(submissions) {
    const total = submissions.length;
    const avgAll = total
      ? (submissions.reduce((acc, s) => acc + s.average, 0) / total).toFixed(1)
      : "—";

    let topBottleneck = "—";
    if (total > 0) {
      const counts = {};
      submissions.forEach((s) => {
        const minVal = Math.min(...Object.values(s.scores));
        DATA.dimensions.forEach((d) => {
          if (s.scores[d.id] === minVal) {
            counts[d.acronym] = (counts[d.acronym] || 0) + 1;
          }
        });
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        topBottleneck = `${sorted[0][0]} (${sorted[0][1]})`;
      }
    }

    els.dbStatsStrip.innerHTML = `
      <div class="db-stat-card">
        <span class="metric-label">Saved Submissions</span>
        <span class="metric-value">${total}</span>
      </div>
      <div class="db-stat-card">
        <span class="metric-label">Mean Readiness</span>
        <span class="metric-value">${avgAll === "—" ? "—" : `${avgAll} / 9`}</span>
      </div>
      <div class="db-stat-card">
        <span class="metric-label">Most Common Lowest</span>
        <span class="metric-value">${escapeHtml(topBottleneck)}</span>
      </div>
    `;
  }

  function exportCsv() {
    const list = state.submissions;
    if (!list || list.length === 0) {
      alert("No submissions available to export.");
      return;
    }

    const headers = [
      "ID",
      "Submitted At",
      "Name",
      "Email Address",
      "Academic Institution",
      "Venture Website",
      "Venture Details",
      "CRL",
      "TRL",
      "BRL",
      "IPRL",
      "TMRL",
      "FRL",
      "Average",
      "Gap"
    ];

    const csvCell = (val) => {
      const str = String(val ?? "");
      return `"${str.replace(/"/g, '""')}"`;
    };

    const lines = [headers.map(csvCell).join(",")];
    list.forEach((s) => {
      lines.push(
        [
          s.id,
          s.createdAt,
          s.fullName,
          s.email,
          s.academicInstitution,
          s.ventureWebsite,
          s.ventureDetails,
          s.scores.CRL,
          s.scores.TRL,
          s.scores.BRL,
          s.scores.IPRL,
          s.scores.TMRL,
          s.scores.FRL,
          s.average,
          s.spread
        ]
          .map(csvCell)
          .join(",")
      );
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kth-irl-submissions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ------------------------------------------------------------------------
     View Switching & Actions
     ------------------------------------------------------------------------ */
  function showView(viewName) {
    state.view = viewName;
    els.assessmentView.hidden = viewName !== "assessment";
    els.resultsView.hidden = viewName !== "results";
    els.databaseView.hidden = viewName !== "database";

    if (viewName === "database") {
      els.navDatabase.setAttribute("aria-current", "page");
      els.navAssessment.removeAttribute("aria-current");
      renderDatabaseView();
    } else {
      els.navAssessment.setAttribute("aria-current", "page");
      els.navDatabase.removeAttribute("aria-current");
      if (viewName === "results") {
        renderResults();
      } else {
        renderActiveDimension();
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectLevel(levelNum) {
    const dim = getActiveDimension();
    state.scores[dim.id] = levelNum;
    showValidationError("");
    saveDraft();
    renderDimensionTabs();
    renderLevelRadiogroup(dim, levelNum);
    renderLevelDetails(dim, levelNum);
    renderAllLevelsPanel(dim, levelNum);
    renderProgress();
  }

  async function handleSubmitAndViewResults() {
    showValidationError("");

    const fullName = state.intake.fullName.trim();
    const email = state.intake.email.trim();
    const institution = state.intake.academicInstitution.trim();
    const ventureDetails = state.intake.ventureDetails.trim();

    if (!fullName) {
      showValidationError("Please enter your Name in the Venture & Contact Intake section.");
      els.fullNameInput.focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showValidationError("Please enter a valid Email Address in the Venture & Contact Intake section.");
      els.emailInput.focus();
      return;
    }
    if (!institution) {
      showValidationError("Please enter your Academic Institution in the Venture & Contact Intake section.");
      els.institutionInput.focus();
      return;
    }
    if (!ventureDetails) {
      showValidationError("Please enter Venture Details in the Venture & Contact Intake section.");
      els.ventureDetailsInput.focus();
      return;
    }
    if (!isAllRated()) {
      const missing = DATA.dimensions.filter((d) => !Number.isInteger(state.scores[d.id]));
      showValidationError(
        `Please rate all 6 dimensions before submitting. Still needed: ${missing.map((m) => m.acronym).join(", ")}.`
      );
      return;
    }

    els.btnViewResults.disabled = true;
    els.btnViewResults.textContent = "Saving...";

    try {
      const saved = await submitToDatabase();
      state.resultsContext = {
        mode: "assessment",
        savedId: saved.id,
        createdAt: saved.createdAt,
        intake: {
          fullName: saved.fullName,
          email: saved.email,
          academicInstitution: saved.academicInstitution,
          ventureWebsite: saved.ventureWebsite,
          ventureDetails: saved.ventureDetails
        },
        scores: { ...saved.scores }
      };
      await refreshDatabaseCount();
      showView("results");
    } catch (err) {
      showValidationError(err.message || "Failed to save submission to database.");
    } finally {
      els.btnViewResults.disabled = false;
      els.btnViewResults.textContent = "Submit & View Results";
    }
  }

  function loadPdfSample() {
    state.resultsContext = {
      mode: "sample",
      savedId: null,
      createdAt: null,
      intake: null,
      scores: { ...DATA.sampleScores }
    };
    showView("results");
  }

  function restartAssessment() {
    state.scores = {};
    state.intake = {
      fullName: "",
      email: "",
      academicInstitution: "",
      ventureWebsite: "",
      ventureDetails: ""
    };
    state.activeDimIndex = 0;
    state.expandAllCriteria = false;
    state.resultsContext = {
      mode: "assessment",
      savedId: null,
      createdAt: null,
      intake: null,
      scores: null
    };
    syncIntakeInputsFromState();
    showValidationError("");
    clearDraft();
    showView("assessment");
  }

  function downloadChartPng() {
    const svgEl = document.getElementById("irl-radar-svg");
    if (!svgEl) return;

    const ctxData = state.resultsContext;
    const activeScores = ctxData.scores || state.scores;
    const titleLabel =
      ctxData.mode === "sample"
        ? "PDF Sample — KTH IRL™ Profile"
        : ctxData.intake && ctxData.intake.fullName
          ? `${ctxData.intake.fullName} — KTH IRL™ Profile`
          : "KTH Innovation Readiness Level™ Profile";

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = function () {
      const width = 1200;
      const height = 1220;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#003366";
      ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(titleLabel, width / 2, 62);

      const scoresLine = DATA.dimensions
        .map((d) => `${d.acronym}: ${activeScores[d.id]}`)
        .join("   |   ");
      ctx.fillStyle = "#435064";
      ctx.font = "600 20px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
      ctx.fillText(scoresLine, width / 2, 98);

      if (ctxData.mode !== "sample" && ctxData.createdAt) {
        ctx.fillStyle = "#5c6b80";
        ctx.font = "500 17px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
        ctx.fillText(`Submitted: ${formatDate(ctxData.createdAt)}`, width / 2, 124);
      }

      ctx.drawImage(img, 40, 134, 1120, 1000);

      ctx.fillStyle = "#5c6b80";
      ctx.font = "16px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
      ctx.fillText(DATA.attribution, width / 2, 1180);

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "kth-irl-profile.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = url;
  }

  /* ------------------------------------------------------------------------
     Event Listeners
     ------------------------------------------------------------------------ */
  function bindEvents() {
    els.navAssessment.addEventListener("click", () => showView("assessment"));
    els.navDatabase.addEventListener("click", () => showView("database"));

    const bindIntakeField = (inputEl, key) => {
      inputEl.addEventListener("input", (e) => {
        state.intake[key] = e.target.value;
        showValidationError("");
        saveDraft();
      });
    };
    bindIntakeField(els.fullNameInput, "fullName");
    bindIntakeField(els.emailInput, "email");
    bindIntakeField(els.institutionInput, "academicInstitution");
    bindIntakeField(els.websiteInput, "ventureWebsite");
    bindIntakeField(els.ventureDetailsInput, "ventureDetails");

    els.dimensionTabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-dim-index]");
      if (!btn) return;
      state.activeDimIndex = Number(btn.dataset.dimIndex);
      saveDraft();
      renderActiveDimension();
    });

    els.levelRadiogroup.addEventListener("change", (e) => {
      if (e.target.classList.contains("level-radio-input")) {
        selectLevel(Number(e.target.value));
      }
    });

    els.levelDetailsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-select-level]");
      if (!btn) return;
      selectLevel(Number(btn.dataset.selectLevel));
    });

    els.allLevelsList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-select-level]");
      if (!btn) return;
      selectLevel(Number(btn.dataset.selectLevel));
    });

    els.btnToggleCompare.addEventListener("click", () => {
      state.compareAdjacent = !state.compareAdjacent;
      renderActiveDimension();
    });

    els.btnToggleAllLevels.addEventListener("click", () => {
      state.showAllLevels = !state.showAllLevels;
      renderActiveDimension();
    });

    els.btnPrevDim.addEventListener("click", () => {
      if (state.activeDimIndex > 0) {
        state.activeDimIndex -= 1;
        saveDraft();
        renderActiveDimension();
      }
    });

    els.btnNextDim.addEventListener("click", () => {
      if (state.activeDimIndex < DATA.dimensions.length - 1) {
        state.activeDimIndex += 1;
        saveDraft();
        renderActiveDimension();
      }
    });

    els.btnViewResults.addEventListener("click", handleSubmitAndViewResults);
    els.btnLoadSample.addEventListener("click", loadPdfSample);
    els.btnRestartTop.addEventListener("click", restartAssessment);
    els.btnRestartResults.addEventListener("click", restartAssessment);
    els.btnEditAnswers.addEventListener("click", () => showView("assessment"));
    els.btnViewDatabaseFromResults.addEventListener("click", () => showView("database"));
    els.btnNewFromDb.addEventListener("click", restartAssessment);

    els.btnDownloadPng.addEventListener("click", downloadChartPng);
    els.btnPrint.addEventListener("click", () => window.print());

    els.btnToggleAllCriteria.addEventListener("click", () => {
      state.expandAllCriteria = !state.expandAllCriteria;
      els.btnToggleAllCriteria.setAttribute("aria-expanded", String(state.expandAllCriteria));
      els.btnToggleAllCriteria.textContent = state.expandAllCriteria
        ? "Collapse All Criteria"
        : "Expand All Criteria";

      els.resultsSummaryList.querySelectorAll(".summary-details").forEach((d) => {
        d.open = state.expandAllCriteria;
      });
    });

    els.dbUnlockForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pw = (els.dbAdminPassword.value || "").trim();
      if (!pw) return;
      els.dbAuthError.hidden = true;
      saveAdminSession(pw);
      els.dbAdminPassword.value = "";
      await renderDatabaseView();
    });

    els.btnLockDb.addEventListener("click", () => {
      clearAdminSession();
      setDatabaseLockState(false);
      els.dbAuthError.hidden = true;
    });

    els.dbSearch.addEventListener("input", () => {
      renderDatabaseView();
    });

    els.btnRefreshDb.addEventListener("click", () => {
      renderDatabaseView();
    });

    els.btnExportCsv.addEventListener("click", exportCsv);

    els.dbContent.addEventListener("click", async (e) => {
      const viewBtn = e.target.closest("[data-view-sub]");
      if (viewBtn) {
        const id = Number(viewBtn.dataset.viewSub);
        const sub = state.submissions.find((s) => s.id === id);
        if (!sub) return;
        state.resultsContext = {
          mode: "saved",
          savedId: sub.id,
          createdAt: sub.createdAt,
          intake: {
            fullName: sub.fullName,
            email: sub.email,
            academicInstitution: sub.academicInstitution,
            ventureWebsite: sub.ventureWebsite,
            ventureDetails: sub.ventureDetails
          },
          scores: { ...sub.scores }
        };
        showView("results");
        return;
      }

      const delBtn = e.target.closest("[data-delete-sub]");
      if (delBtn) {
        const id = Number(delBtn.dataset.deleteSub);
        if (!confirm(`Delete submission #${id} from the database?`)) return;
        try {
          await deleteSubmission(id);
          await refreshDatabaseCount();
          renderDatabaseView();
        } catch (err) {
          alert(err.message);
        }
      }
    });

    window.addEventListener("beforeprint", () => {
      if (state.view === "results") {
        els.resultsSummaryList.querySelectorAll(".summary-details").forEach((d) => {
          d.dataset.wasOpen = d.open ? "1" : "0";
          d.open = true;
        });
      }
    });

    window.addEventListener("afterprint", () => {
      if (state.view === "results") {
        els.resultsSummaryList.querySelectorAll(".summary-details").forEach((d) => {
          if (d.dataset.wasOpen === "0") {
            d.open = false;
          }
          delete d.dataset.wasOpen;
        });
      }
    });
  }

  /* ------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------ */
  function init() {
    loadAdminSession();
    loadDraft();
    syncIntakeInputsFromState();
    bindEvents();
    renderActiveDimension();
    refreshDatabaseCount();
  }

  init();
})();
