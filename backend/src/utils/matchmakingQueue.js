// src/utils/matchmakingQueue.js
import redis from "../lib/redisClient.js";

const QUEUE_KEY = "match_queue";
const PLAYER_TTL = 300; // seconds before a player's entry expires
const LOCK_TTL = 5; // seconds for matchmaking lock

// Add player to queue using a Sorted Set (score = XP for range-based matching)
export async function enqueuePlayer(player) {
  const data = JSON.stringify({
    ...player,
    joinedAt: Date.now(),
  });
  // Use XP as score for efficient range-based matching
  await redis.zAdd(QUEUE_KEY, { score: player.xp || 0, value: data });
  // Set per-player expiry key so stale entries can be cleaned
  await redis.set(`match_player:${player.userId}`, data, { EX: PLAYER_TTL });
}

// Remove specific player from queue (atomic)
export async function removePlayer(userId) {
  // Find the player's entry via their per-player key
  const playerData = await redis.get(`match_player:${userId}`);
  if (playerData) {
    await redis.zRem(QUEUE_KEY, playerData);
    await redis.del(`match_player:${userId}`);
    return;
  }
  // Fallback: scan the sorted set (only if per-player key expired)
  const players = await redis.zRange(QUEUE_KEY, 0, -1);
  for (const p of players) {
    try {
      const parsed = JSON.parse(p);
      if (parsed.userId === userId) {
        await redis.zRem(QUEUE_KEY, p);
        break;
      }
    } catch { /* skip malformed entries */ }
  }
}

// Try to find a match for player — uses distributed lock to prevent double-matching
export async function findMatchForPlayer(newPlayer) {
  // Acquire a lock to prevent concurrent match attempts from grabbing the same opponent
  const lockKey = `match_lock:${newPlayer.userId}`;
  const lockAcquired = await redis.set(lockKey, "1", { NX: true, EX: LOCK_TTL });
  if (!lockAcquired) {
    // Another request is already trying to match this player
    return null;
  }

  try {
    const players = await redis.zRange(QUEUE_KEY, 0, -1);
    let bestMatch = null;
    let smallestXpDiff = Infinity;

    for (const p of players) {
      let parsed;
      try { parsed = JSON.parse(p); } catch { continue; }
      if (parsed.userId === newPlayer.userId) continue;

      // Check for stale entries (player TTL expired)
      const still = await redis.exists(`match_player:${parsed.userId}`);
      if (!still) {
        // Clean up stale entry
        await redis.zRem(QUEUE_KEY, p);
        continue;
      }

      // Must have at least 1 common topic
      const hasCommonTopic = parsed.topics.some((t) =>
        newPlayer.topics.includes(t)
      );

      if (hasCommonTopic) {
        const xpDiff = Math.abs(parsed.xp - newPlayer.xp);
        if (xpDiff < smallestXpDiff) {
          smallestXpDiff = xpDiff;
          bestMatch = parsed;
        }
      }
    }

    // If we found a match, remove both atomically
    if (bestMatch) {
      // Use a pipeline to remove both players atomically
      const pipeline = redis.multi();
      const bestData = await redis.get(`match_player:${bestMatch.userId}`);
      const newData = await redis.get(`match_player:${newPlayer.userId}`);
      if (bestData) pipeline.zRem(QUEUE_KEY, bestData);
      if (newData) pipeline.zRem(QUEUE_KEY, newData);
      pipeline.del(`match_player:${bestMatch.userId}`);
      pipeline.del(`match_player:${newPlayer.userId}`);
      await pipeline.exec();
      return bestMatch;
    }

    return null;
  } finally {
    // Release the lock
    await redis.del(lockKey);
  }
}

export async function getQueueSize() {
  return await redis.zCard(QUEUE_KEY);
}
