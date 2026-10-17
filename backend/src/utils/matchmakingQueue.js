// src/utils/matchmakingQueue.js
import { randomUUID } from "crypto";
import redis from "../lib/redisClient.js";

const QUEUE_KEY = "matchmaking_queue"; // hash: userId -> JSON player entry
const LOCK_KEY = "match_queue_lock";
const LOCK_TTL_MS = 3000;
const LOCK_RETRY_MS = 50;
const LOCK_MAX_ATTEMPTS = 60;
const ENTRY_TTL_MS = 100_000; // slightly longer than the client's 90s search window
const FOUND_TTL_S = 60;
const foundKey = (userId) => `match_found:${userId}`;

// Delete the lock only if we still own it
const RELEASE_LOCK_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
end
return 0`;

// One queue-wide lock: pairing reads and mutates the whole queue, so per-player locks
// would let two requests grab the same waiting opponent.
async function withQueueLock(fn) {
  const token = randomUUID();
  for (let attempt = 0; attempt < LOCK_MAX_ATTEMPTS; attempt++) {
    const acquired = await redis.set(LOCK_KEY, token, {
      condition: "NX",
      expiration: { type: "PX", value: LOCK_TTL_MS },
    });
    if (acquired) {
      try {
        return await fn();
      } finally {
        await redis.eval(RELEASE_LOCK_SCRIPT, { keys: [LOCK_KEY], arguments: [token] });
      }
    }
    await new Promise((resolve) => setTimeout(resolve, LOCK_RETRY_MS));
  }
  throw new Error("Matchmaking is busy, try again");
}

// Pair `player` with the closest-XP waiting player on the same difficulty with a shared topic,
// or enqueue them. Returns the opponent's entry, or null if `player` is now waiting.
export function pairOrEnqueue(player) {
  return withQueueLock(async () => {
    const entries = await redis.hGetAll(QUEUE_KEY);
    const now = Date.now();
    let best = null;

    for (const [userId, raw] of Object.entries(entries)) {
      if (userId === player.userId) continue;
      let candidate;
      try {
        candidate = JSON.parse(raw);
      } catch {
        await redis.hDel(QUEUE_KEY, userId);
        continue;
      }
      if (now - candidate.joinedAt > ENTRY_TTL_MS) {
        await redis.hDel(QUEUE_KEY, userId);
        continue;
      }
      if (candidate.difficulty !== player.difficulty) continue;
      if (!candidate.topics.some((t) => player.topics.includes(t))) continue;
      if (!best || Math.abs(candidate.xp - player.xp) < Math.abs(best.xp - player.xp)) {
        best = candidate;
      }
    }

    if (best) {
      await redis.hDel(QUEUE_KEY, [best.userId, player.userId]);
      return best;
    }
    await redis.hSet(QUEUE_KEY, player.userId, JSON.stringify({ ...player, joinedAt: now }));
    return null;
  });
}

export async function leaveQueue(userId) {
  await redis.hDel(QUEUE_KEY, userId);
}

// The waiting player learns about their match via socket, but may miss the event
// (socket reconnecting, page not mounted yet), so it is also stored for polling.
export async function recordFoundMatch(userId, matchId) {
  await redis.set(foundKey(userId), matchId, { expiration: { type: "EX", value: FOUND_TTL_S } });
}

export async function takeFoundMatch(userId) {
  return redis.getDel(foundKey(userId));
}
