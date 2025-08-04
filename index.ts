import * as kv from './kv';

console.log('Hello via Bun!');

await kv.set('test', 'test2');

console.log(await kv.get('test'));
