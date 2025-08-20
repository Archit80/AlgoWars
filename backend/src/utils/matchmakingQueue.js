// src/utils/matchmakingQueue.js
import redis from "../lib/redisClient.js";

const QUEUE_KEY = "match_queue";
const MATCH_EXPIRY = 300; // seconds before queue entry expires

// Add player to queue
export async function enqueuePlayer(player) {
  const data = JSON.stringify({
    ...player,
    joinedAt: Date.now(),
  });
  await redis.rPush(QUEUE_KEY, data);
  await redis.expire(QUEUE_KEY, MATCH_EXPIRY);
}

// Remove specific player from queue
export async function removePlayer(userId) {
  const players = await redis.lRange(QUEUE_KEY, 0, -1);
  for (const p of players) {
    const parsed = JSON.parse(p);
    if (parsed.userId === userId) {
      await redis.lRem(QUEUE_KEY, 1, p);
      break;
    }
  }
}

// Try to find a match for player
export async function findMatchForPlayer(newPlayer) {
  const players = await redis.lRange(QUEUE_KEY, 0, -1);
  let bestMatch = null;
  let smallestXpDiff = Infinity;

  for (const p of players) {
    const parsed = JSON.parse(p);
    if (parsed.userId === newPlayer.userId) continue;

    // Must have at least 1 common topic
    const hasCommonTopic = parsed.topics.some((t) =>
      newPlayer.topics.includes(t)
    );

    if (hasCommonTopic) {
      const xpDiff = Math.abs(parsed.xp - newPlayer.xp);

      // Find the player with closest XP
      if (xpDiff < smallestXpDiff) {
        smallestXpDiff = xpDiff;
        bestMatch = parsed;
      }
    }
  }

  // If we found a match, remove both from queue
  if (bestMatch) {
    await removePlayer(bestMatch.userId);
    await removePlayer(newPlayer.userId);
    return bestMatch;
  }

  return null;
}

export async function getQueueSize() {
  return await redis.lLen(QUEUE_KEY);
}
