import sqlite from "./results.sqlite" with { "type": "sqlite" };

export interface Result {
  modelName: string;
  systemPromptName: string;
  category: string;
  question: string;
  answer: string;
}

export async function saveResult(result: Result) {
  await sqlite
    .query(
      `
    INSERT OR REPLACE INTO results (
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
