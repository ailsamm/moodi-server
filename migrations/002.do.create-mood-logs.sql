DROP TABLE IF EXISTS moodi_mood_logs;

CREATE TABLE moodi_mood_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES moodi_users(id) ON DELETE CASCADE NOT NULL,
    mood TEXT NOT NULL,
    activities TEXT NOT NULL,
    notes TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    sleep_hours INTEGER NOT NULL
);