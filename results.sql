PRAGMA foreign_keys=on;

CREATE TABLE results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_name TEXT NOT NULL,
  system_prompt_name TEXT NOT NULL,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  winner INTEGER CHECK (winner IN (0,1)) DEFAULT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(model_name, system_prompt_name, category, question)
);

CREATE TABLE scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  result_id INTEGER NOT NULL,
  criteria TEXT NOT NULL,
  score REAL NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (result_id) REFERENCES results(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_scores_result_id ON scores(result_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_scores_result_criteria ON scores(result_id, criteria);