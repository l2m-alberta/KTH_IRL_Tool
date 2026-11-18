const {
  REQUIRED_DIMENSIONS,
  supabaseFetch,
  verifyAdminPassword,
  rowToDto
} = require("./_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const auth = verifyAdminPassword(req);
    if (!auth.ok) {
      return res.status(auth.status).json({ error: auth.error });
    }

    try {
      const q = String((req.query && req.query.q) || "").trim();
      let path = "submissions?select=*&order=id.desc";
      if (q) {
        const clean = q.replace(/[%(),]/g, " ").trim();
        if (clean) {
          const pattern = encodeURIComponent(`*${clean}*`);
          path += `&or=(full_name.ilike.${pattern},email.ilike.${pattern},academic_institution.ilike.${pattern},venture_details.ilike.${pattern})`;
        }
      }

      const rows = await supabaseFetch(path, { method: "GET" });
      return res.status(200).json({
        submissions: (rows || []).map(rowToDto)
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Database error." });
    }
  }

  if (req.method === "POST") {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();
    const academicInstitution = String(body.academicInstitution || "").trim();
    const ventureWebsite = String(body.ventureWebsite || "").trim();
    const ventureDetails = String(body.ventureDetails || "").trim();
    const scores = body.scores && typeof body.scores === "object" ? body.scores : {};

    if (!fullName) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid Email Address is required." });
    }
    if (!academicInstitution) {
      return res.status(400).json({ error: "Academic Institution is required." });
    }
    if (!ventureDetails) {
      return res.status(400).json({ error: "Venture Details are required." });
    }

    const parsedScores = {};
    for (const dim of REQUIRED_DIMENSIONS) {
      const val = Number(scores[dim]);
      if (!Number.isInteger(val) || val < 1 || val > 9) {
        return res
          .status(400)
          .json({ error: `Valid integer score (1-9) required for ${dim}.` });
      }
      parsedScores[dim] = val;
    }

    try {
      const rows = await supabaseFetch("submissions", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          academic_institution: academicInstitution,
          venture_website: ventureWebsite,
          venture_details: ventureDetails,
          crl: parsedScores.CRL,
          trl: parsedScores.TRL,
          brl: parsedScores.BRL,
          iprl: parsedScores.IPRL,
          tmrl: parsedScores.TMRL,
          frl: parsedScores.FRL
        })
      });

      const created = Array.isArray(rows) ? rows[0] : rows;
      return res.status(201).json({ submission: rowToDto(created) });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Failed to save submission." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed." });
};
