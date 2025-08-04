import db from "./cache.sqlite" with { "type": "sqlite" };
import deterministicHash from 'deterministic-object-hash';

// const hash = await deterministicHash({
//   now: new Date().toISOString(),
//   prompt: "test",
//   response: "test",
// });

// const value = 'test'

// const query = db.query("INSERT INTO kv (hash, value) VALUES ($hash, $value)");

// query.run({ $hash: hash, $value: value });

// console.log(db.query("select * from kv").all());

export async function get(hash: string) {
  const result = await db.query("SELECT value FROM kv WHERE hash = ?").get(hash);
  return result?.value;
}

export async function set(hash: string, value: string) {
  await db.query("INSERT OR REPLACE INTO kv (hash, value) VALUES (?, ?)").run(hash, value);
}