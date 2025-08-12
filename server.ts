import sqlite from "./results.sqlite" with { type: "sqlite" };
import humanevalHtml from './humaneval.html';
import { z } from 'zod';

type HumanevalCriteria = string[];

const CRITERIA: HumanevalCriteria = ['correctness', 'clarity', 'reasoning'];

type ResultRow = {
  id: number;
  modelName: string;
  systemPromptName: string;
  categoryName: string;
  question: string;
  answer: string;
  createdAt: string;
};

type ScoreRow = {
  result_id: number;
  criteria: string;
  score: number;
};

const scoreSchema = z.object({
  resultId: z.number(),
  criteria: z.string(),
  score: z.number(),
});

async function getPairsWithResultsMissingScores() {
  const results: ResultRow[] = await sqlite
    .query(
      `
      SELECT 
        r.id as id,
        r.model_name as modelName,
        r.system_prompt_name as systemPromptName,
        r.category as categoryName,
        r.question as question,
        r.answer as answer,
        r.created_at as createdAt
      FROM results r
      ORDER BY r.category, r.question, r.created_at DESC
    `,
    )
    .all();

  if (results.length === 0) {
    return [] as Array<{
      category: string;
      question: string;
      results: Array<
        ResultRow & {
          scores: Record<string, number | null>;
        }
      >;
    }>;
  }

  const resultIds = results.map((r) => r.id);
  const placeholders = resultIds.map(() => '?').join(',');

  const allScores: ScoreRow[] = resultIds.length
    ? await sqlite
        .query(
          `
        SELECT result_id, criteria, score
        FROM scores
        WHERE result_id IN (${placeholders})
      `,
        )
        .all(...resultIds)
    : [];

  const resultIdToScores = new Map<number, Record<string, number | null>>();
  for (const r of results) {
    const initial: Record<string, number | null> = {};
    for (const c of CRITERIA) initial[c] = null;
    resultIdToScores.set(r.id, initial);
  }
  for (const s of allScores) {
    const map = resultIdToScores.get(s.result_id);
    if (map) {
      map[s.criteria] = s.score;
    }
  }

  const pairKey = (r: ResultRow) => `${r.categoryName}__SEP__${r.question}`;
  const pairs = new Map<
    string,
    {
      category: string;
      question: string;
      results: Array<
        ResultRow & {
          scores: Record<string, number | null>;
        }
      >;
    }
  >();

  for (const r of results) {
    const key = pairKey(r);
    if (!pairs.has(key)) {
      pairs.set(key, {
        category: r.categoryName,
        question: r.question,
        results: [],
      });
    }
    pairs.get(key)!.results.push({ ...r, scores: resultIdToScores.get(r.id)! });
  }

  const filtered = Array.from(pairs.values()).filter((pair) => {
    // keep pairs where at least one result is missing any criterion score
    return pair.results.some((res) => CRITERIA.some((c) => res.scores[c] == null));
  });

  return filtered;
}

async function upsertScore({ resultId, criteria, score }: { resultId: number; criteria: string; score: number }) {
  const updated = await sqlite
    .query(
      `
      UPDATE scores
      SET score = ?
      WHERE result_id = ? AND criteria = ?
    `,
    )
    .run(score, resultId, criteria);

  // If no existing row was updated, insert one
  // @ts-ignore - run() returns info with changes property in Bun's sqlite
  if (!updated || !updated.changes) {
    await sqlite
      .query(
        `
        INSERT INTO scores (result_id, criteria, score)
        VALUES (?, ?, ?)
      `,
      )
      .run(resultId, criteria, score);
  }
}

Bun.serve({
  routes: {
    '/': humanevalHtml,
    '/api/humaneval': {
      GET: async () => {
        const pairs = await getPairsWithResultsMissingScores();
        return Response.json({ criteria: CRITERIA, pairs });
      },
    },
    '/api/score': {
      GET: async () => {
        const pairs = await getPairsWithResultsMissingScores();
        return Response.json({ criteria: CRITERIA, pairs });
      },
      PUT: async (req) => {
        try {
          const { resultId, criteria, score } = scoreSchema.parse(await req.json());

          await sqlite
            .query(
              `
              INSERT INTO scores (result_id, criteria, score)
              VALUES (?, ?, ?)
              ON CONFLICT(result_id, criteria)
              DO UPDATE SET score = excluded.score
            `,
            )
            .run(resultId, criteria, score);

          return Response.json({ ok: true });
        } catch (error) {
          return Response.json({ error: 'Invalid Payload' }, { status: 400 });
        }
      },
    },
    '/api/criteria': () => {
      return Response.json({ criteria: CRITERIA });
    },
  },
  error(error) {
    console.error(error);
    return new Response(`Internal Error: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  },
});

console.log('Listening: http://localhost:3000');
