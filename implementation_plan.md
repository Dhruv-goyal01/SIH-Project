# Flask Backend — Consolidated Final Project

## Summary

Consolidate all game frontends and a single Flask backend into `d:\SIH\final-project\`. The patient dashboard is the entry point. Each game card launches its respective game page. No frontend files will be edited — only the JavaScript `fetch()` URLs will be adjusted to point to the single backend at `http://127.0.0.1:5000`. The caretaker dashboard is copied as-is with backend routes added but no HTML buttons connecting to it.

## Proposed Structure

```
final-project/
├── app.py                  ← Single Flask app (ALL routes combined)
├── database.py             ← DB helpers
├── schema.sql              ← Unified schema
├── requirements.txt
├── neurobloom.db           ← One SQLite database
│
├── templates/              ← Flask templates (static HTML served via Flask)
│   ├── patient-dashboard/  
│   │   ├── index.html      (copied, unchanged)
│   │   └── styles.css      (copied)
│   ├── memory-cards/
│   │   ├── index.html      (copied, fetch URL updated to /api/memory-card/*)
│   │   ├── script.js       (fetch URLs updated)
│   │   └── style.css
│   ├── phrase-recall/
│   │   ├── index.html      (copied, unchanged)
│   │   ├── script.js       (fetch URL updated to /api/phrase-recall/*)
│   │   └── style.css
│   ├── memory-flash/       ← built React dist (served statically)
│   │   ├── index.html
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── assets/
│   └── caretaker-dashboard/
│       ├── index.html      (copied, unchanged)
│       ├── style.css
│       ├── script.js
│       ├── patients.js
│       ├── analysis-best.html
│       ├── analysis-logic.html
│       ├── analysis-memory.html
│       └── analysis_common.js
│
└── static/
    └── assets/             ← patient-dashboard images
        ├── avatar.jpg
        ├── game-memory-card.jpg
        ├── game-memory-flash.jpg
        └── game-phrase-builder.jpg
```

## Backend API Routes (app.py)

### Shared
- `GET /` → serves patient-dashboard `index.html`
- `GET /memory-cards` → serves memory-cards `index.html`
- `GET /phrase-recall` → serves phrase-recall `index.html`
- `GET /memory-flash` → serves memory-flash `index.html`
- `GET /caretaker` → serves caretaker-dashboard `index.html`

### Memory Cards API (merged from memory-cards/backend/app.py)
- `POST /api/memory-card/game/start`
- `POST /api/memory-card/game/complete`
- `GET  /api/memory-card/game/history/<patient_id>`
- `GET  /api/memory-card/game/progress/<patient_id>`
- `GET  /api/memory-card/game/progress/history/<patient_id>`

### Phrase Recall API (merged from phrase-recall/backend/app.py)
- `POST /api/phrase-recall/game/complete`

### Caretaker API (new routes — no HTML buttons yet)
- `GET  /api/caretaker/patients` → list all patients
- `GET  /api/caretaker/patients/<id>/summary` → get patient summary
- `GET  /api/caretaker/patients/<id>/game-history` → get all game history across games
- `POST /api/caretaker/patients/<id>/care-log` → add a care log entry
- `GET  /api/caretaker/patients/<id>/care-log` → get care log entries

### Patient management
- `POST /api/patients` → create patient (existing)
- `GET  /api/patients` → list patients

## Schema Changes

A single `neurobloom.db` with:
- `patients` table (same as memory-cards schema)
- `memory_card_sessions` table (renamed from `game_sessions` in memory-cards)
- `phrase_recall_sessions` table (from phrase-recall schema)
- `care_log_entries` table (new, for caretaker backend)

## JavaScript URL Changes

Only two script files need fetch URL updates:

**memory-cards/script.js** (3 fetch calls):
- `http://127.0.0.1:5000/api/game/start` → `/api/memory-card/game/start`
- `http://127.0.0.1:5000/api/game/complete` → `/api/memory-card/game/complete`

**phrase-recall/script.js** (1 fetch call):
- `http://127.0.0.1:5000/api/game/complete` → `/api/phrase-recall/game/complete`

**patient-dashboard/index.html** (game card buttons):
- Add `onclick` handlers to redirect to `/memory-cards`, `/phrase-recall`, `/memory-flash`

> [!IMPORTANT]
> The patient dashboard game cards currently have no `href` or navigation logic. A small inline script will be added to the existing `<script>` block at the bottom of `index.html` to make the game cards navigate — but the existing HTML structure and all other interactivity will not be changed.

> [!NOTE]
> Memory Flash is a React Vite app (pre-built dist). It will be served as static files from Flask. Since it uses absolute `/assets/...` paths in its built HTML, Flask will serve the assets correctly.

## Verification

1. Run `python app.py` from `final-project/`
2. Open `http://127.0.0.1:5000` → patient dashboard loads
3. Click game cards → navigates to respective games
4. Play a game → results POST to backend, DB updated
5. Caretaker routes respond to API calls (no UI entry point yet)
