-- NeuroBloom Unified Schema
-- All game data lives in one database

-- Patients table (shared across games)
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    preferred_language TEXT DEFAULT 'English',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Memory Card game sessions
CREATE TABLE IF NOT EXISTS memory_card_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    game_type TEXT NOT NULL DEFAULT 'memory_card',
    difficulty TEXT DEFAULT 'easy',

    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    moves INTEGER DEFAULT 0,
    time_taken REAL DEFAULT 0,
    mistakes INTEGER DEFAULT 0,
    score REAL DEFAULT 0,
    accuracy REAL DEFAULT 0,

    completed INTEGER DEFAULT 0,

    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Phrase Recall game sessions
CREATE TABLE IF NOT EXISTS phrase_recall_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    game_name TEXT NOT NULL DEFAULT 'Recall Game',
    difficulty TEXT NOT NULL,
    phrase TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    correct INTEGER NOT NULL,
    score INTEGER NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Care log entries (for caretaker dashboard backend)
CREATE TABLE IF NOT EXISTS care_log_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    entry_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Insert default patient if none exist
INSERT OR IGNORE INTO patients (id, name, age, preferred_language)
VALUES (1, 'Arundhati', 72, 'Assamese');
