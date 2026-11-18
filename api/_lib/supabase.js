const crypto = require("crypto");

const REQUIRED_DIMENSIONS = ["CRL", "TRL", "BRL", "IPRL", "TMRL", "FRL"];

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/i, "");
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !serviceKey) {
    throw new Error(
      "Server is missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }
  return { url, serviceKey };
}

async function supabaseFetch(path, options = {}) {
  const { url, serviceKey } = getSupabaseConfig();
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_err) {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.hint)) ||
      `Supabase request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

function verifyAdminPassword(req) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) {
    return {
      ok: false,
      status: 503,
      error: "ADMIN_PASSWORD is not configured on the server."
    };
  }

  const provided = String(req.headers["x-admin-password"] || "");
  if (!provided) {
    return { ok: false, status: 401, error: "Admin password required." };
  }

  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, status: 401, error: "Invalid admin password." };
  }

  return { ok: true };
}

function rowToDto(row) {
  const scores = {
    CRL: row.crl,
    TRL: row.trl,
    BRL: row.brl,
    IPRL: row.iprl,
    TMRL: row.tmrl,
    FRL: row.frl
  };
  const vals = Object.values(scores);
  const avg = vals.reduce((acc, v) => acc + v, 0) / vals.length;
  return {
    id: row.id,
    createdAt: row.created_at,
    fullName: row.full_name,
    email: row.email,
    academicInstitution: row.academic_institution,
    ventureWebsite: row.venture_website || "",
    ventureDetails: row.venture_details,
    scores,
    average: Math.round(avg * 100) / 100,
    spread: Math.max(...vals) - Math.min(...vals)
  };
}

module.exports = {
  REQUIRED_DIMENSIONS,
  supabaseFetch,
  verifyAdminPassword,
  rowToDto
};
