import { Redis } from '@upstash/redis';

export type StoredRingToken = { accessToken: string; refreshToken?: string; accountId: string; receivedAt: number };

const pending = new Map<string, StoredRingToken>();
let active: StoredRingToken | undefined;
const processed = new Set<string>();
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  : process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

const pendingKey = (id: string) => `backtrack:ring:pending:${id}`;
const pendingIdsKey = 'backtrack:ring:pending-ids';
const activeKey = 'backtrack:ring:active';

export async function savePending(id: string, token: StoredRingToken) {
  if (!redis) { pending.set(id, token); return; }
  await redis.set(pendingKey(id), token, { ex: 900 });
  await redis.sadd(pendingIdsKey, id);
}

export async function takePending(match: (token: StoredRingToken) => boolean) {
  if (!redis) {
    const found = [...pending.entries()].filter(([, token]) => match(token));
    if (found.length !== 1) return null;
    pending.delete(found[0][0]);
    return found[0][1];
  }
  const ids = await redis.smembers<string[]>(pendingIdsKey);
  const matches: Array<{ id: string; token: StoredRingToken }> = [];
  for (const id of ids ?? []) {
    const token = await redis.get<StoredRingToken>(pendingKey(id));
    if (!token) { await redis.srem(pendingIdsKey, id); continue; }
    if (match(token)) matches.push({ id, token });
  }
  if (matches.length !== 1) return null;
  await redis.del(pendingKey(matches[0].id));
  await redis.srem(pendingIdsKey, matches[0].id);
  return matches[0].token;
}

export async function saveActive(token: StoredRingToken) {
  if (!redis) { active = token; return; }
  await redis.set(activeKey, token);
}

export async function getActive() {
  if (!redis) return active;
  return await redis.get<StoredRingToken>(activeKey);
}

export async function markWebhookProcessed(id: string) {
  if (!redis) {
    if (processed.has(id)) return false;
    processed.add(id);
    return true;
  }
  return (await redis.set(`backtrack:ring:webhook:${id}`, '1', { nx: true, ex: 86_400 })) === 'OK';
}

export const ringStore = { persistent: Boolean(redis) };
