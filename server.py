#!/usr/bin/env python3
"""
KTH Innovation Readiness Level (IRL)™ — Local Server & SQLite Database

Serves the static front-end and provides a local SQLite-backed REST API
for storing and browsing intake + IRL assessment submissions.
Uses only Python standard library modules (no external dependencies).
"""

import hmac
import json
import os
import sqlite3
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "irl_submissions.db")
PORT = int(os.environ.get("PORT", "8000"))
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")

REQUIRED_DIMENSIONS = ("CRL", "TRL", "BRL", "IPRL", "TMRL", "FRL")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                academic_institution TEXT NOT NULL,
                venture_website TEXT DEFAULT '',
                venture_details TEXT NOT NULL,
                project_name TEXT DEFAULT '',
                crl INTEGER NOT NULL CHECK (crl BETWEEN 1 AND 9),
                trl INTEGER NOT NULL CHECK (trl BETWEEN 1 AND 9),
                brl INTEGER NOT NULL CHECK (brl BETWEEN 1 AND 9),
                iprl INTEGER NOT NULL CHECK (iprl BETWEEN 1 AND 9),
                tmrl INTEGER NOT NULL CHECK (tmrl BETWEEN 1 AND 9),
                frl INTEGER NOT NULL CHECK (frl BETWEEN 1 AND 9)
            )
            """
        )
        conn.commit()


def row_to_dict(row):
    scores = {
        "CRL": row["crl"],
        "TRL": row["trl"],
        "BRL": row["brl"],
        "IPRL": row["iprl"],
        "TMRL": row["tmrl"],
        "FRL": row["frl"],
    }
    vals = list(scores.values())
    return {
        "id": row["id"],
        "createdAt": row["created_at"],
        "fullName": row["full_name"],
        "email": row["email"],
        "academicInstitution": row["academic_institution"],
        "ventureWebsite": row["venture_website"] or "",
        "ventureDetails": row["venture_details"],
        "projectName": row["project_name"] or "",
        "scores": scores,
        "average": round(sum(vals) / len(vals), 2),
        "spread": max(vals) - min(vals),
    }


class IRLRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def check_admin(self):
        provided = self.headers.get("x-admin-password", "")
        if not provided:
            self.send_json(401, {"error": "Admin password required."})
            return False
        if not hmac.compare_digest(provided, ADMIN_PASSWORD):
            self.send_json(401, {"error": "Invalid admin password."})
            return False
        return True

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/submissions":
            if not self.check_admin():
                return
            query_params = parse_qs(parsed.query)
            search = (query_params.get("q", [""])[0] or "").strip().lower()
            with get_db_connection() as conn:
                if search:
                    like = f"%{search}%"
                    rows = conn.execute(
                        """
                        SELECT * FROM submissions
                        WHERE LOWER(full_name) LIKE ?
                           OR LOWER(email) LIKE ?
                           OR LOWER(academic_institution) LIKE ?
                           OR LOWER(venture_details) LIKE ?
                           OR LOWER(project_name) LIKE ?
                        ORDER BY id DESC
                        """,
                        (like, like, like, like, like),
                    ).fetchall()
                else:
                    rows = conn.execute(
                        "SELECT * FROM submissions ORDER BY id DESC"
                    ).fetchall()
            self.send_json(200, {"submissions": [row_to_dict(r) for r in rows]})
            return

        if parsed.path.startswith("/api/submissions/"):
            sub_id_str = parsed.path.removeprefix("/api/submissions/").strip("/")
            if not sub_id_str.isdigit():
                self.send_json(400, {"error": "Invalid submission ID."})
                return
            with get_db_connection() as conn:
                row = conn.execute(
                    "SELECT * FROM submissions WHERE id = ?", (int(sub_id_str),)
                ).fetchone()
            if not row:
                self.send_json(404, {"error": "Submission not found."})
                return
            self.send_json(200, {"submission": row_to_dict(row)})
            return

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/submissions":
            self.send_json(404, {"error": "Endpoint not found."})
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0 or content_length > 1_000_000:
            self.send_json(400, {"error": "Invalid request body size."})
            return

        try:
            raw_body = self.rfile.read(content_length)
            data = json.loads(raw_body.decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            self.send_json(400, {"error": "Invalid JSON payload."})
            return

        full_name = str(data.get("fullName", "")).strip()
        email = str(data.get("email", "")).strip()
        academic_institution = str(data.get("academicInstitution", "")).strip()
        venture_website = str(data.get("ventureWebsite", "")).strip()
        venture_details = str(data.get("ventureDetails", "")).strip()
        project_name = str(data.get("projectName", "")).strip()
        scores = data.get("scores") or {}

        if not full_name:
            self.send_json(400, {"error": "Name is required."})
            return
        if not email or "@" not in email or "." not in email.split("@")[-1]:
            self.send_json(400, {"error": "A valid Email Address is required."})
            return
        if not academic_institution:
            self.send_json(400, {"error": "Academic Institution is required."})
            return
        if not venture_details:
            self.send_json(400, {"error": "Venture Details are required."})
            return

        parsed_scores = {}
        for dim in REQUIRED_DIMENSIONS:
            val = scores.get(dim)
            if not isinstance(val, int) or val < 1 or val > 9:
                self.send_json(
                    400, {"error": f"Valid integer score (1-9) required for {dim}."}
                )
                return
            parsed_scores[dim] = val

        created_at = datetime.now(timezone.utc).isoformat()

        with get_db_connection() as conn:
            cur = conn.execute(
                """
                INSERT INTO submissions (
                    created_at, full_name, email, academic_institution,
                    venture_website, venture_details, project_name,
                    crl, trl, brl, iprl, tmrl, frl
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    created_at,
                    full_name,
                    email,
                    academic_institution,
                    venture_website,
                    venture_details,
                    project_name,
                    parsed_scores["CRL"],
                    parsed_scores["TRL"],
                    parsed_scores["BRL"],
                    parsed_scores["IPRL"],
                    parsed_scores["TMRL"],
                    parsed_scores["FRL"],
                ),
            )
            new_id = cur.lastrowid
            row = conn.execute(
                "SELECT * FROM submissions WHERE id = ?", (new_id,)
            ).fetchone()
            conn.commit()

        self.send_json(201, {"submission": row_to_dict(row)})

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/api/submissions/"):
            self.send_json(404, {"error": "Endpoint not found."})
            return
        if not self.check_admin():
            return

        sub_id_str = parsed.path.removeprefix("/api/submissions/").strip("/")
        if not sub_id_str.isdigit():
            self.send_json(400, {"error": "Invalid submission ID."})
            return

        with get_db_connection() as conn:
            cur = conn.execute(
                "DELETE FROM submissions WHERE id = ?", (int(sub_id_str),)
            )
            conn.commit()

        if cur.rowcount == 0:
            self.send_json(404, {"error": "Submission not found."})
            return

        self.send_json(200, {"deleted": int(sub_id_str)})


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer(("", PORT), IRLRequestHandler)
    print(f"KTH IRL Tool & Database server running at http://localhost:{PORT}")
    print(f"SQLite database: {DB_PATH}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        server.server_close()
