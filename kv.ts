import sqlite from "./cache.sqlite" with { "type": "sqlite" };

export async function get(hash: string) {
  const result = await sqlite.query('SELECT value FROM kv WHERE hash = ?').get(hash);
  return result?.value;
}

export async function set(hash: string, value: string) {
  await sqlite.query('INSERT OR REPLACE INTO kv (hash, value) VALUES (?, ?)').run(hash, value);
}