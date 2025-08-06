CREATE TABLE results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_name TEXT NOT NULL,
  system_prompt_name TEXT NOT NULL,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(model_name, system_prompt_name, category, question)
);