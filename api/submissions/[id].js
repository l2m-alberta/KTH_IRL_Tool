const { supabaseFetch, verifyAdminPassword } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const auth = verifyAdminPassword(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const rawId = req.query && req.query.id;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid submission ID." });
  }

  try {
    const deletedRows = await supabaseFetch(`submissions?id=eq.${id}`, {
      method: "DELETE",
      headers: { Prefer: "return=representation" }
    });

    if (!Array.isArray(deletedRows) || deletedRows.length === 0) {
      return res.status(404).json({ error: "Submission not found." });
    }

    return res.status(200).json({ deleted: id });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to delete submission." });
  }
};
