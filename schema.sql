-- NeuroBloom Unified Schema — PostgreSQL
-- All game data lives in one database

-- 1. Patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    preferred_language VARCHAR(50) DEFAULT 'English',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Memory Card game sessions
CREATE TABLE IF NOT EXISTS memory_card_sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    game_type VARCHAR(50) NOT NULL DEFAULT 'memory_card',
    difficulty VARCHAR(50) DEFAULT 'easy',

    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,

    moves INTEGER DEFAULT 0,
    time_taken DOUBLE PRECISION DEFAULT 0,
    mistakes INTEGER DEFAULT 0,
    score DOUBLE PRECISION DEFAULT 0,
    accuracy DOUBLE PRECISION DEFAULT 0,

    completed SMALLINT DEFAULT 0
);

-- 3. Phrase Recall game sessions
CREATE TABLE IF NOT EXISTS phrase_recall_sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    game_name VARCHAR(100) NOT NULL DEFAULT 'Recall Game',
    difficulty VARCHAR(50) NOT NULL,
    phrase TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    correct SMALLINT NOT NULL,
    score INTEGER NOT NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Care log entries (caretaker dashboard)
CREATE TABLE IF NOT EXISTS care_log_entries (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    entry_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster patient-based queries
CREATE INDEX IF NOT EXISTS idx_memory_card_patient ON memory_card_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_phrase_recall_patient ON phrase_recall_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_care_log_patient ON care_log_entries(patient_id);

-- Seed default patient
INSERT INTO patients (id, name, age, preferred_language)
VALUES (1, 'Arundhati', 72, 'Assamese')
ON CONFLICT (id) DO NOTHING;

-- Keep the SERIAL sequence in sync after manual seed
SELECT setval(pg_get_serial_sequence('patients', 'id'), COALESCE(MAX(id), 1)) FROM patients;
