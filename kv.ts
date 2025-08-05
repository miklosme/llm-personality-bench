import db from "./cache.sqlite" with { "type": "sqlite" };

export async function get(hash: string) {
  const result = await db.query("SELECT value FROM kv WHERE hash = ?").get(hash);
  return result?.value;
}

export async function set(hash: string, value: string) {
  await db.query("INSERT OR REPLACE INTO kv (hash, value) VALUES (?, ?)").run(hash, value);
}