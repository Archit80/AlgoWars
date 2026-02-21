import redis, { ensureRedisConnection } from "../lib/redisClient.js";

const QUEUE_KEY = "match_queue:waiting";
const PLAYER_KEY_PREFIX = "match_queue:player";
const PLAYER_EXPIRY = 300; // seconds
const SEARCH_WINDOW_STEP = 150;
const MAX_SEARCH_WINDOW = 5000;
const MAX_CANDIDATES = 40;

const getPlayerKey = (userId) => `${PLAYER_KEY_PREFIX}:${userId}`;

function parseTopics(rawTopics) {
  if (!rawTopics) return [];
  try {
    const parsed = JSON.parse(rawTopics);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getPlayersByIds(userIds) {
  if (!userIds.length) return [];

  const multi = redis.multi();
  userIds.forEach((id) => multi.hGetAll(getPlayerKey(id)));
  const rows = await multi.exec();

  return userIds
    .map((id, idx) => {
      const row = rows[idx];
      if (!row || !row.userId) return null;
      return {
        userId: row.userId,
        username: row.username,
        xp: Number(row.xp || 0),
        joinedAt: Number(row.joinedAt || Date.now()),
        topics: parseTopics(row.topics),
      };
    })
    .filter(Boolean);
}

export async function enqueuePlayer(player) {
  await ensureRedisConnection();

  const payload = {
    userId: player.userId,
    username: player.username,
    xp: Number(player.xp || 0),
    joinedAt: Date.now(),
    topics: JSON.stringify(Array.isArray(player.topics) ? player.topics : []),
  };

  const playerKey = getPlayerKey(player.userId);
  await redis
    .multi()
    .hSet(playerKey, payload)
    .expire(playerKey, PLAYER_EXPIRY)
    .zAdd(QUEUE_KEY, { score: payload.xp, value: player.userId })
    .exec();
}

export async function removePlayer(userId) {
  await ensureRedisConnection();

  await redis
    .multi()
    .zRem(QUEUE_KEY, userId)
    .del(getPlayerKey(userId))
    .exec();
}

function hasCommonTopic(topicsA, topicsB) {
  if (!topicsA.length || !topicsB.length) return false;

  const smaller = topicsA.length <= topicsB.length ? topicsA : topicsB;
  const larger = smaller === topicsA ? topicsB : topicsA;
  const set = new Set(larger);

  return smaller.some((topic) => set.has(topic));
}

async function findBestCandidate(newPlayer) {
  const newPlayerXp = Number(newPlayer.xp || 0);
  const newPlayerTopics = Array.isArray(newPlayer.topics) ? newPlayer.topics : [];

  let bestMatch = null;
  let smallestXpDiff = Infinity;

  for (
    let windowSize = SEARCH_WINDOW_STEP;
    windowSize <= MAX_SEARCH_WINDOW && !bestMatch;
    windowSize += SEARCH_WINDOW_STEP
  ) {
    const candidateIds = await redis.zRangeByScore(
      QUEUE_KEY,
      newPlayerXp - windowSize,
      newPlayerXp + windowSize,
      { LIMIT: { offset: 0, count: MAX_CANDIDATES } }
    );

    const filteredIds = candidateIds.filter((id) => id !== newPlayer.userId);
    if (!filteredIds.length) continue;

    const candidates = await getPlayersByIds(filteredIds);

    for (const candidate of candidates) {
      if (!hasCommonTopic(candidate.topics, newPlayerTopics)) continue;

      const xpDiff = Math.abs(candidate.xp - newPlayerXp);
      if (xpDiff < smallestXpDiff) {
        smallestXpDiff = xpDiff;
        bestMatch = candidate;
      }
    }
  }

  return bestMatch;
}

export async function findMatchForPlayer(newPlayer) {
  await ensureRedisConnection();

  const bestMatch = await findBestCandidate(newPlayer);
  if (!bestMatch) return null;

  // Best-effort claim: only proceed if opponent was still waiting.
  const [removedOpponent] = await redis
    .multi()
    .zRem(QUEUE_KEY, bestMatch.userId)
    .zRem(QUEUE_KEY, newPlayer.userId)
    .del(getPlayerKey(bestMatch.userId))
    .del(getPlayerKey(newPlayer.userId))
    .exec();

  if (!removedOpponent) {
    return null;
  }

  return bestMatch;
}

export async function getQueueSize() {
  await ensureRedisConnection();
  return redis.zCard(QUEUE_KEY);
}
