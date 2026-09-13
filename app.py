"""
NeuroBloom — Consolidated Flask Backend (PostgreSQL)
Serves all game frontends and provides a unified REST API.

Pages:
  GET /                    → Patient Dashboard
  GET /memory-cards        → Memory Card game
  GET /phrase-recall       → Phrase Recall game
  GET /memory-flash        → Memory Flash game (React built dist)
  GET /caretaker           → Caretaker Dashboard

APIs:
  Patients:
    POST /api/patients
    GET  /api/patients

  Memory Card game:
    POST /api/memory-card/game/start
    POST /api/memory-card/game/complete
    GET  /api/memory-card/game/history/<patient_id>
    GET  /api/memory-card/game/progress/<patient_id>
    GET  /api/memory-card/game/progress/history/<patient_id>

  Phrase Recall game:
    POST /api/phrase-recall/game/complete

  Caretaker:
    GET  /api/caretaker/patients
    GET  /api/caretaker/patients/<patient_id>/summary
    GET  /api/caretaker/patients/<patient_id>/game-history
    POST /api/caretaker/patients/<patient_id>/care-log
    GET  /api/caretaker/patients/<patient_id>/care-log
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# ---------------------------------------------------------------------------
# Load environment variables from .env
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# ---------------------------------------------------------------------------
# PostgreSQL connection
# ---------------------------------------------------------------------------
def get_db():
    """Open and return a new PostgreSQL connection (rows behave like dicts)."""
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        dbname=os.getenv("DB_NAME", "neurobloom"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        cursor_factory=RealDictCursor,
    )

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

app = Flask(__name__, static_folder=None)
CORS(app)


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
def calculate_performance(moves, mistakes, time_taken):
    """Calculate accuracy and score from game metrics."""
    accuracy = ((moves - mistakes) / moves * 100) if moves > 0 else 0
    score = max(0, round(1000 - (mistakes * 100) - (time_taken * 5)))
    return {"accuracy": round(accuracy, 2), "score": score}


def send_template(path):
    """Serve a file relative to the templates/ directory."""
    full_path = os.path.join(TEMPLATES_DIR, path)
    return send_from_directory(os.path.dirname(full_path), os.path.basename(full_path))


# ===========================================================================
# PAGE ROUTES — serve the static frontends
# ===========================================================================

@app.route("/")
def patient_dashboard():
    return send_template("patient-dashboard/index.html")


@app.route("/memory-cards")
def memory_cards_page():
    return send_template("memory-cards/index.html")


@app.route("/phrase-recall")
def phrase_recall_page():
    return send_template("phrase-recall/index.html")


@app.route("/memory-flash")
def memory_flash_page():
    return send_template("memory-flash/index.html")


@app.route("/caretaker")
def caretaker_page():
    return send_template("caretaker-dashboard/index.html")


@app.route("/caretaker/<path:filename>")
def caretaker_static(filename):
    return send_from_directory(os.path.join(TEMPLATES_DIR, "caretaker-dashboard"), filename)


# ---------------------------------------------------------------------------
# Static file serving for each frontend subfolder
# ---------------------------------------------------------------------------

@app.route("/static/patient-dashboard/<path:filename>")
def patient_dashboard_static(filename):
    return send_from_directory(os.path.join(TEMPLATES_DIR, "patient-dashboard"), filename)


@app.route("/static/memory-cards/<path:filename>")
def memory_cards_static(filename):
    return send_from_directory(os.path.join(TEMPLATES_DIR, "memory-cards"), filename)


@app.route("/static/phrase-recall/<path:filename>")
def phrase_recall_static(filename):
    return send_from_directory(os.path.join(TEMPLATES_DIR, "phrase-recall"), filename)


@app.route("/static/memory-flash/<path:filename>")
def memory_flash_static(filename):
    return send_from_directory(os.path.join(TEMPLATES_DIR, "memory-flash"), filename)


@app.route("/assets/<path:filename>")
def memory_flash_assets(filename):
    return send_from_directory(
        os.path.join(TEMPLATES_DIR, "memory-flash", "assets"), filename
    )


@app.route("/favicon.svg")
def memory_flash_favicon():
    return send_from_directory(os.path.join(TEMPLATES_DIR, "memory-flash"), "favicon.svg")


@app.route("/icons.svg")
def memory_flash_icons():
    return send_from_directory(os.path.join(TEMPLATES_DIR, "memory-flash"), "icons.svg")


# ===========================================================================
# PATIENT API
# ===========================================================================

@app.route("/api/patients", methods=["POST"])
def create_patient():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    name = data.get("name")
    age = data.get("age")
    preferred_language = data.get("preferred_language", "English")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO patients (name, age, preferred_language) VALUES (%s, %s, %s) RETURNING id",
                (name, age, preferred_language),
            )
            patient_id = cur.fetchone()["id"]
        conn.commit()
    finally:
        conn.close()

    return jsonify({
        "message": "Patient created successfully",
        "patient_id": patient_id,
        "patient": {"name": name, "age": age, "preferred_language": preferred_language},
    }), 201


@app.route("/api/patients", methods=["GET"])
def list_patients():
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, age, preferred_language FROM patients")
            rows = cur.fetchall()
    finally:
        conn.close()
    return jsonify({"patients": [dict(r) for r in rows]}), 200


# ===========================================================================
# MEMORY CARD GAME API
# ===========================================================================

@app.route("/api/memory-card/game/start", methods=["POST"])
def memory_card_start():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    patient_id = data.get("patient_id")
    game_type  = data.get("game_type", "memory_card")
    difficulty = data.get("difficulty", "easy")

    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM patients WHERE id = %s", (patient_id,))
            if not cur.fetchone():
                return jsonify({"error": "Patient not found"}), 404

            cur.execute(
                "INSERT INTO memory_card_sessions (patient_id, game_type, difficulty) VALUES (%s, %s, %s) RETURNING id",
                (patient_id, game_type, difficulty),
            )
            session_id = cur.fetchone()["id"]
        conn.commit()
    finally:
        conn.close()

    return jsonify({
        "message": "Game started successfully",
        "session_id": session_id,
        "game": {"patient_id": patient_id, "game_type": game_type, "difficulty": difficulty},
    }), 201


@app.route("/api/memory-card/game/complete", methods=["POST"])
def memory_card_complete():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    session_id = data.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id is required"}), 400

    moves      = data.get("moves", 0)
    time_taken = data.get("time_taken", 0)
    mistakes   = data.get("mistakes", 0)
    completed  = data.get("completed", 1)

    perf     = calculate_performance(moves, mistakes, time_taken)
    accuracy = perf["accuracy"]
    score    = perf["score"]

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM memory_card_sessions WHERE id = %s", (session_id,))
            if not cur.fetchone():
                return jsonify({"error": "Game session not found"}), 404

            cur.execute(
                """UPDATE memory_card_sessions
                   SET completed_at = CURRENT_TIMESTAMP,
                       moves = %s, time_taken = %s, mistakes = %s,
                       score = %s, accuracy = %s, completed = %s
                   WHERE id = %s""",
                (moves, time_taken, mistakes, score, accuracy, completed, session_id),
            )
        conn.commit()
    finally:
        conn.close()

    return jsonify({
        "message": "Game completed successfully",
        "session_id": session_id,
        "results": {
            "moves": moves, "time_taken": time_taken, "mistakes": mistakes,
            "score": score, "accuracy": accuracy, "completed": completed,
        },
    }), 200


@app.route("/api/memory-card/game/history/<int:patient_id>", methods=["GET"])
def memory_card_history(patient_id):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM patients WHERE id = %s", (patient_id,))
            if not cur.fetchone():
                return jsonify({"error": "Patient not found"}), 404

            cur.execute(
                """SELECT id, game_type, difficulty, started_at, completed_at,
                          moves, time_taken, mistakes, score, accuracy, completed
                   FROM memory_card_sessions
                   WHERE patient_id = %s AND completed = 1
                   ORDER BY id DESC""",
                (patient_id,),
            )
            sessions = cur.fetchall()
    finally:
        conn.close()

    return jsonify({
        "patient_id": patient_id,
        "games": [dict(s) for s in sessions],
    }), 200


@app.route("/api/memory-card/game/progress/<int:patient_id>", methods=["GET"])
def memory_card_progress(patient_id):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM patients WHERE id = %s", (patient_id,))
            if not cur.fetchone():
                return jsonify({"error": "Patient not found"}), 404

            cur.execute(
                """SELECT COUNT(*) AS total_games,
                          AVG(accuracy)   AS average_accuracy,
                          AVG(time_taken) AS average_time,
                          AVG(mistakes)   AS average_mistakes,
                          MAX(score)      AS best_score
                   FROM memory_card_sessions
                   WHERE patient_id = %s AND completed = 1""",
                (patient_id,),
            )
            stats = cur.fetchone()

            cur.execute(
                """SELECT accuracy, score, time_taken, mistakes
                   FROM memory_card_sessions
                   WHERE patient_id = %s AND completed = 1
                   ORDER BY id DESC LIMIT 1""",
                (patient_id,),
            )
            latest = cur.fetchone()
    finally:
        conn.close()

    return jsonify({
        "patient_id": patient_id,
        "progress": {
            "total_games":       stats["total_games"],
            "average_accuracy":  round(float(stats["average_accuracy"]  or 0), 2),
            "average_time":      round(float(stats["average_time"]      or 0), 2),
            "average_mistakes":  round(float(stats["average_mistakes"]  or 0), 2),
            "best_score":        round(float(stats["best_score"]        or 0), 2),
            "latest_accuracy":   round(float(latest["accuracy"])   if latest else 0, 2),
            "latest_score":      round(float(latest["score"])      if latest else 0, 2),
            "latest_time":       round(float(latest["time_taken"]) if latest else 0, 2),
            "latest_mistakes":   latest["mistakes"] if latest else 0,
        },
    }), 200


@app.route("/api/memory-card/game/progress/history/<int:patient_id>", methods=["GET"])
def memory_card_progress_history(patient_id):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM patients WHERE id = %s", (patient_id,))
            if not cur.fetchone():
                return jsonify({"error": "Patient not found"}), 404

            cur.execute(
                """SELECT id, accuracy, score, time_taken, mistakes, difficulty, completed_at
                   FROM memory_card_sessions
                   WHERE patient_id = %s AND completed = 1
                   ORDER BY id ASC""",
                (patient_id,),
            )
            sessions = cur.fetchall()
    finally:
        conn.close()

    progress = [
        {
            "game_number": i,
            "session_id":  s["id"],
            "accuracy":    s["accuracy"],
            "score":       s["score"],
            "time_taken":  s["time_taken"],
            "mistakes":    s["mistakes"],
            "difficulty":  s["difficulty"],
            "completed_at": s["completed_at"].isoformat() if s["completed_at"] else None,
        }
        for i, s in enumerate(sessions, start=1)
    ]

    return jsonify({"patient_id": patient_id, "progress": progress}), 200


# ===========================================================================
# PHRASE RECALL GAME API
# ===========================================================================

@app.route("/api/phrase-recall/game/complete", methods=["POST"])
def phrase_recall_complete():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    required = ["patient_id", "difficulty", "phrase", "user_answer", "correct", "score"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    if data["difficulty"] not in ["easy", "medium", "hard"]:
        return jsonify({"error": "Invalid difficulty"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO phrase_recall_sessions
                   (patient_id, game_name, difficulty, phrase, user_answer, correct, score)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (
                    data["patient_id"],
                    "Recall Game",
                    data["difficulty"],
                    data["phrase"],
                    data["user_answer"],
                    1 if data["correct"] else 0,
                    data["score"],
                ),
            )
        conn.commit()
    finally:
        conn.close()

    return jsonify({"message": "Game result saved successfully"}), 200


# ===========================================================================
# CARETAKER API
# ===========================================================================

@app.route("/api/caretaker/patients", methods=["GET"])
def caretaker_list_patients():
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, age, preferred_language FROM patients")
            rows = cur.fetchall()
    finally:
        conn.close()
    return jsonify({"patients": [dict(r) for r in rows]}), 200


@app.route("/api/caretaker/patients/<int:patient_id>/summary", methods=["GET"])
def caretaker_patient_summary(patient_id):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, age, preferred_language FROM patients WHERE id = %s",
                (patient_id,),
            )
            patient = cur.fetchone()
            if not patient:
                return jsonify({"error": "Patient not found"}), 404

            cur.execute(
                """SELECT COUNT(*) AS total_games,
                          AVG(accuracy) AS avg_accuracy,
                          MAX(score)    AS best_score
                   FROM memory_card_sessions
                   WHERE patient_id = %s AND completed = 1""",
                (patient_id,),
            )
            mc_stats = cur.fetchone()

            cur.execute(
                """SELECT COUNT(*) AS total_rounds,
                          SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct_rounds,
                          SUM(score) AS total_score
                   FROM phrase_recall_sessions
                   WHERE patient_id = %s""",
                (patient_id,),
            )
            pr_stats = cur.fetchone()
    finally:
        conn.close()

    return jsonify({
        "patient": dict(patient),
        "memory_card": {
            "total_games":  mc_stats["total_games"],
            "avg_accuracy": round(float(mc_stats["avg_accuracy"] or 0), 2),
            "best_score":   round(float(mc_stats["best_score"]   or 0), 2),
        },
        "phrase_recall": {
            "total_rounds":   pr_stats["total_rounds"],
            "correct_rounds": pr_stats["correct_rounds"] or 0,
            "total_score":    pr_stats["total_score"]    or 0,
        },
    }), 200


@app.route("/api/caretaker/patients/<int:patient_id>/game-history", methods=["GET"])
def caretaker_game_history(patient_id):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM patients WHERE id = %s", (patient_id,))
            if not cur.fetchone():
                return jsonify({"error": "Patient not found"}), 404

            cur.execute(
                """SELECT id, 'memory_card' AS game, difficulty, score, accuracy,
                          time_taken, mistakes, completed_at AS played_at
                   FROM memory_card_sessions
                   WHERE patient_id = %s AND completed = 1
                   ORDER BY id DESC LIMIT 20""",
                (patient_id,),
            )
            mc_sessions = cur.fetchall()

            cur.execute(
                """SELECT id, 'phrase_recall' AS game, difficulty, score,
                          correct, phrase, user_answer, played_at
                   FROM phrase_recall_sessions
                   WHERE patient_id = %s
                   ORDER BY id DESC LIMIT 20""",
                (patient_id,),
            )
            pr_sessions = cur.fetchall()
    finally:
        conn.close()

    return jsonify({
        "patient_id": patient_id,
        "memory_card_sessions":  [dict(s) for s in mc_sessions],
        "phrase_recall_sessions": [dict(s) for s in pr_sessions],
    }), 200


@app.route("/api/caretaker/patients/<int:patient_id>/care-log", methods=["GET"])
def caretaker_get_care_log(patient_id):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM patients WHERE id = %s", (patient_id,))
            if not cur.fetchone():
                return jsonify({"error": "Patient not found"}), 404

            cur.execute(
                """SELECT id, entry_text, created_at
                   FROM care_log_entries
                   WHERE patient_id = %s ORDER BY id DESC""",
                (patient_id,),
            )
            entries = cur.fetchall()
    finally:
        conn.close()

    return jsonify({
        "patient_id": patient_id,
        "entries": [dict(e) for e in entries],
    }), 200


@app.route("/api/caretaker/patients/<int:patient_id>/care-log", methods=["POST"])
def caretaker_add_care_log(patient_id):
    data = request.get_json()
    if not data or not data.get("entry_text"):
        return jsonify({"error": "entry_text is required"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM patients WHERE id = %s", (patient_id,))
            if not cur.fetchone():
                return jsonify({"error": "Patient not found"}), 404

            cur.execute(
                "INSERT INTO care_log_entries (patient_id, entry_text) VALUES (%s, %s) RETURNING id",
                (patient_id, data["entry_text"]),
            )
            entry_id = cur.fetchone()["id"]
        conn.commit()
    finally:
        conn.close()

    return jsonify({"message": "Care log entry added", "entry_id": entry_id}), 201


# ===========================================================================
# Run
# ===========================================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
