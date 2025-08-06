import sqlite from "./cache.sqlite" with { "type": "sqlite" };

// import { Database } from 'bun:sqlite';

// const sqlite = new Database('cache.sqlite');

async function get(hash: string) {
  const result = await sqlite.query('SELECT value FROM kv WHERE hash = ?').get(hash);
  return result?.value;
}

async function set(hash: string, value: string) {
  await sqlite.query('INSERT OR REPLACE INTO kv (hash, value) VALUES (?, ?)').run(hash, value);
}

export interface BenchmarkResult {
  modelName: string;
  systemPromptName: string;
  category: string;
  question: string;
  answer: string;
}

async function saveResult(result: BenchmarkResult) {
  await sqlite
    .query(
      `
    INSERT INTO results (
      model_name, system_prompt_name, category, question, answer
    ) VALUES (?, ?, ?, ?, ?)
  `,
    )
    .run(result.modelName, result.systemPromptName, result.category, result.question, result.answer);
}

export async function getAllResults() {
  return await sqlite
    .query(
      `
    SELECT 
      model_name as modelName,
      system_prompt_name as systemPromptName,
      category,
      question,
      answer,
      created_at as createdAt
    FROM results 
    ORDER BY created_at DESC
  `,
    )
    .all();
}

export const kv = {
  get,
  set,
};

export const db = {
  saveResult,
  getAllResults,
};
