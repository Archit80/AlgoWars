// Server-authoritative 1v1 match engine.
//
// - Every state transition is a guarded DB write (updateMany with the expected status/index),
//   so concurrent callers (both players answering, a deadline firing, a disconnect forfeit)
//   can race safely: exactly one wins each transition.
// - Question deadlines live in a Redis sorted set (score = deadline ms) so they survive restarts.
//   The server that sets a deadline also arms an in-memory timer for it; a slow Redis sweep is
//   only the recovery path (restarts, other instances). Either way the handler claims the entry
//   with ZREM first, so each deadline fires exactly once.
// - Clients get one `match:question { index, startsAt, endsAt, serverNow }` per question and
//   count down locally — no per-second broadcasts.
import prisma from '../db/prismaClient.js';
import redis from '../lib/redisClient.js';
import AchievementService, { streakUpdate } from './achievementService.js';

const QUESTION_MS = 60_000;
const START_DELAY_MS = 3_000;
const JOIN_TIMEOUT_MS = 30_000;
const ANSWER_GRACE_MS = 1_000; // tolerate network latency right at the deadline
const MAX_CONSECUTIVE_MISSES = 2;
const STALE_MATCH_MS = 15 * 60_000;
const FRIEND_ROOM_TTL_MS = 30 * 60_000;
const RECOVERY_SWEEP_INTERVAL_MS = 10_000; // keep Redis command volume low (Upstash quotas)
const STALE_SWEEP_INTERVAL_MS = 60_000;
const ROOM_RELEASE_DELAY_MS = 5_000;
const KEY_TTL_S = 2 * 60 * 60;

const DEADLINES_KEY = 'match_deadlines';
const clockKey = (matchId) => `match:${matchId}:clock`;
const joinedKey = (matchId) => `match:${matchId}:joined`;

// Match questions have no explicit position; ordering by id gives every read the same order.
export const ORDERED_QUESTIONS = { orderBy: { id: 'asc' } };

export class MatchError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function computeMatchXP(score, isWinner) {
  return 50 + score * 25 + (isWinner ? 100 : 0);
}

let io = null;

export function initMatchEngine(ioServer) {
  io = ioServer;
  setInterval(runExclusive(sweepDeadlines), RECOVERY_SWEEP_INTERVAL_MS);
  const staleSweep = runExclusive(sweepStaleMatches);
  setInterval(staleSweep, STALE_SWEEP_INTERVAL_MS);
  staleSweep();
}

// Skip a tick if the previous run is still in progress (slow DB must not cause overlap).
function runExclusive(fn) {
  let running = false;
  return async () => {
    if (running) return;
    running = true;
    try {
      await fn();
    } catch (err) {
      console.error(`[MatchEngine] ${fn.name} failed:`, err);
    } finally {
      running = false;
    }
  };
}

function emit(matchId, event, payload) {
  io?.to(matchId).emit(event, payload);
}

// ── Deadline scheduling ──────────────────────────────────────────────────

const localTimers = new Map(); // matchId -> timeout for its current deadline

async function scheduleDeadline(matchId, at, condition) {
  const added = await redis.zAdd(DEADLINES_KEY, { score: at, value: matchId }, condition ? { condition } : undefined);
  if (condition && !added) return; // NX: an earlier deadline already stands
  armLocalTimer(matchId, at);
}

function armLocalTimer(matchId, at) {
  clearTimeout(localTimers.get(matchId));
  const timer = setTimeout(() => {
    localTimers.delete(matchId);
    claimAndHandle(matchId).catch((err) => console.error(`[MatchEngine] deadline for ${matchId} failed:`, err));
  }, Math.max(0, at - Date.now()));
  timer.unref?.();
  localTimers.set(matchId, timer);
}

async function claimAndHandle(matchId) {
  // ZREM is the claim: only one timer/sweeper (on any instance) handles each deadline
  if ((await redis.zRem(DEADLINES_KEY, matchId)) !== 1) return;
  await handleDeadline(matchId);
}

async function getClock(matchId) {
  const raw = await redis.get(clockKey(matchId));
  return raw ? JSON.parse(raw) : null;
}

async function setClock(matchId, clock, condition) {
  const ok = await redis.set(clockKey(matchId), JSON.stringify(clock), {
    ...(condition && { condition }),
    expiration: { type: 'EX', value: KEY_TTL_S },
  });
  if (!ok) return false;
  await scheduleDeadline(matchId, clock.endsAt);
  return true;
}

function questionPayload(matchId, clock) {
  return { matchId, index: clock.index, startsAt: clock.startsAt, endsAt: clock.endsAt, serverNow: Date.now() };
}

async function clearMatchKeys(matchId) {
  clearTimeout(localTimers.get(matchId));
  localTimers.delete(matchId);
  await Promise.all([
    redis.zRem(DEADLINES_KEY, matchId),
    redis.del([clockKey(matchId), joinedKey(matchId)]),
  ]);
}

// ── Lifecycle ────────────────────────────────────────────────────────────

// Call when a match becomes ONGOING: if the players don't both join in time, the deadline
// sweeper resolves it (forfeit the no-show, or abandon if nobody came).
export async function registerNewMatch(matchId) {
  await scheduleDeadline(matchId, Date.now() + JOIN_TIMEOUT_MS, 'NX');
}

export async function playerJoined(matchId, userId, socket) {
  await redis.sAdd(joinedKey(matchId), userId);
  await redis.expire(joinedKey(matchId), KEY_TTL_S);

  // Already running (reconnect): sync just this socket to the current question
  const clock = await getClock(matchId);
  if (clock) {
    socket.emit('match:question', questionPayload(matchId, clock));
    return;
  }

  if ((await redis.sCard(joinedKey(matchId))) >= 2) {
    await startMatch(matchId);
  } else {
    socket.emit('match:waiting', { matchId });
  }
}

async function startMatch(matchId) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { status: true, currentIndex: true },
  });
  if (!match || match.status !== 'ONGOING') return;

  const startsAt = Date.now() + START_DELAY_MS;
  const clock = { index: match.currentIndex, startsAt, endsAt: startsAt + QUESTION_MS };
  // NX: if both players' joins race here, only one starts the clock
  if (await setClock(matchId, clock, 'NX')) {
    emit(matchId, 'match:question', questionPayload(matchId, clock));
  }
}

async function advance(matchId, fromIndex) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { status: true, _count: { select: { questions: true } } },
  });
  if (!match || match.status !== 'ONGOING') return;

  const nextIndex = fromIndex + 1;
  if (nextIndex >= match._count.questions) {
    await finalizeMatch(matchId);
    return;
  }

  const { count } = await prisma.match.updateMany({
    where: { id: matchId, status: 'ONGOING', currentIndex: fromIndex },
    data: { currentIndex: nextIndex },
  });
  if (count === 0) return; // another caller already advanced past fromIndex

  const startsAt = Date.now();
  const clock = { index: nextIndex, startsAt, endsAt: startsAt + QUESTION_MS };
  await setClock(matchId, clock);
  emit(matchId, 'match:question', questionPayload(matchId, clock));
}

export async function submitAnswer(matchId, userId, questionId, answer) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { questions: { ...ORDERED_QUESTIONS, select: { id: true, answer: true } } },
  });
  if (!match) throw new MatchError(404, 'Match not found');
  if (match.status !== 'ONGOING') throw new MatchError(400, 'Match not active');
  if (userId !== match.user1Id && userId !== match.user2Id) {
    throw new MatchError(403, 'User is not part of this match');
  }

  const clock = await getClock(matchId);
  const now = Date.now();
  if (!clock || now < clock.startsAt) throw new MatchError(400, 'Match has not started');

  const index = match.currentIndex;
  const question = match.questions[index];
  if (!question || question.id !== questionId) throw new MatchError(400, 'Not current question');
  if (now > clock.endsAt + ANSWER_GRACE_MS) throw new MatchError(400, "Time's up");

  const correct = question.answer === answer;
  const scoreField = userId === match.user1Id ? 'user1Score' : 'user2Score';
  try {
    await prisma.$transaction([
      prisma.matchAnswer.create({ data: { matchId, userId, questionId, answer, correct } }),
      // Atomic increment: concurrent answers from both players can't overwrite each other
      ...(correct ? [prisma.match.update({ where: { id: matchId }, data: { [scoreField]: { increment: 1 } } })] : []),
    ]);
  } catch (err) {
    if (err.code === 'P2002') throw new MatchError(409, 'Already answered');
    throw err;
  }

  emit(matchId, 'match:answer', { matchId, userId, index });

  const answeredCount = await prisma.matchAnswer.count({ where: { matchId, questionId } });
  if (answeredCount >= 2) await advance(matchId, index);

  return { correct, index };
}

export async function forfeitMatch(matchId, exiterId) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { status: true, user1Id: true, user2Id: true },
  });
  if (!match || match.status !== 'ONGOING') return;
  if (exiterId !== match.user1Id && exiterId !== match.user2Id) return;
  await finalizeMatch(matchId, { exiterId });
}

// The single exit point for every match. Guarded on status, so it runs at most once per match.
//   exiterId  — that player forfeits: score 0, opponent wins
//   abandoned — nobody played: completed with no winner and no stats/XP
export async function finalizeMatch(matchId, { exiterId = null, abandoned = false } = {}) {
  const result = await prisma.$transaction(async (tx) => {
    const { count } = await tx.match.updateMany({
      where: { id: matchId, status: 'ONGOING' },
      data: { status: 'COMPLETED' },
    });
    if (count === 0) return null;

    const match = await tx.match.findUnique({
      where: { id: matchId },
      select: { user1Id: true, user2Id: true, answers: { select: { userId: true, correct: true } } },
    });
    const tally = (uid) => {
      const mine = match.answers.filter((a) => a.userId === uid);
      return { answered: mine.length, correct: mine.filter((a) => a.correct).length };
    };
    const t1 = tally(match.user1Id);
    const t2 = tally(match.user2Id);

    let user1Score = t1.correct;
    let user2Score = t2.correct;
    let winnerId = null;
    if (exiterId) {
      if (exiterId === match.user1Id) user1Score = 0;
      else user2Score = 0;
      winnerId = exiterId === match.user1Id ? match.user2Id : match.user1Id;
    } else if (!abandoned) {
      if (user1Score > user2Score) winnerId = match.user1Id;
      else if (user2Score > user1Score) winnerId = match.user2Id;
    }

    await tx.match.update({ where: { id: matchId }, data: { user1Score, user2Score, winnerId } });

    if (!abandoned) {
      const now = new Date();
      const players = [
        [match.user1Id, user1Score, t1],
        [match.user2Id, user2Score, t2],
      ].filter(([uid]) => uid);
      for (const [uid, score, t] of players) {
        const streak = await streakUpdate(tx, uid, now); // before lastMatchAt moves to now
        await tx.user.update({
          where: { id: uid },
          data: {
            ...streak,
            xp: { increment: computeMatchXP(score, uid === winnerId) },
            totalMatches: { increment: 1 },
            correctAnswers: { increment: t.correct },
            totalAnswers: { increment: t.answered },
            lastMatchAt: now,
            ...(winnerId && (uid === winnerId
              ? { matchesWon: { increment: 1 } }
              : { matchesLost: { increment: 1 } })),
          },
        });
      }
    }

    return { user1Id: match.user1Id, user2Id: match.user2Id, user1Score, user2Score, winnerId };
  }, { timeout: 15_000 });

  if (!result) return;

  await clearMatchKeys(matchId);
  emit(matchId, 'match:completed', {
    matchId,
    winnerId: result.winnerId,
    user1Score: result.user1Score,
    user2Score: result.user2Score,
    forfeit: Boolean(exiterId),
    exiterId,
    abandoned,
  });
  setTimeout(() => io?.in(matchId).socketsLeave(matchId), ROOM_RELEASE_DELAY_MS);

  if (!abandoned) {
    for (const uid of [result.user1Id, result.user2Id].filter(Boolean)) {
      await AchievementService.checkAchievements(uid);
    }
  }
}

// ── Deadlines ────────────────────────────────────────────────────────────

async function sweepDeadlines() {
  const due = await redis.zRangeByScore(DEADLINES_KEY, 0, Date.now());
  for (const matchId of due) {
    try {
      await claimAndHandle(matchId);
    } catch (err) {
      console.error(`[MatchEngine] deadline for ${matchId} failed:`, err);
    }
  }
}

async function handleDeadline(matchId) {
  const clock = await getClock(matchId);
  if (!clock) return handleJoinTimeout(matchId);

  if (clock.endsAt > Date.now()) {
    // advance() moved the deadline after we read it; put the live one back
    await scheduleDeadline(matchId, clock.endsAt);
    return;
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      status: true,
      currentIndex: true,
      user1Id: true,
      user2Id: true,
      questions: { ...ORDERED_QUESTIONS, select: { id: true } },
    },
  });
  if (!match || match.status !== 'ONGOING') return clearMatchKeys(matchId);

  const index = match.currentIndex;
  if (index !== clock.index) {
    // Clock fell behind the DB (e.g. crash between the two writes): restart the current question
    const startsAt = Date.now();
    const fresh = { index, startsAt, endsAt: startsAt + QUESTION_MS };
    await setClock(matchId, fresh);
    emit(matchId, 'match:question', questionPayload(matchId, fresh));
    return;
  }

  // A player who missed the last MAX_CONSECUTIVE_MISSES questions forfeits
  if (index + 1 >= MAX_CONSECUTIVE_MISSES) {
    const recentIds = match.questions
      .slice(index + 1 - MAX_CONSECUTIVE_MISSES, index + 1)
      .map((q) => q.id);
    const answers = await prisma.matchAnswer.findMany({
      where: { matchId, questionId: { in: recentIds } },
      select: { userId: true },
    });
    const idle = [match.user1Id, match.user2Id].filter((uid) => !answers.some((a) => a.userId === uid));
    if (idle.length === 2) return finalizeMatch(matchId, { abandoned: true });
    if (idle.length === 1) return finalizeMatch(matchId, { exiterId: idle[0] });
  }

  await advance(matchId, index);
}

async function handleJoinTimeout(matchId) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { status: true, user1Id: true, user2Id: true },
  });
  if (!match || match.status !== 'ONGOING') return clearMatchKeys(matchId);

  const joined = await redis.sMembers(joinedKey(matchId));
  if (joined.length >= 2) return startMatch(matchId);
  if (joined.length === 1) {
    const absent = joined[0] === match.user1Id ? match.user2Id : match.user1Id;
    return finalizeMatch(matchId, { exiterId: absent });
  }
  return finalizeMatch(matchId, { abandoned: true });
}

// Safety net for matches stuck ONGOING with no deadline (e.g. Redis data loss, legacy matches),
// and cleanup of friend rooms nobody joined.
async function sweepStaleMatches() {
  const { count: expiredRooms } = await prisma.match.deleteMany({
    where: { status: 'WAITING', user2Id: null, createdAt: { lt: new Date(Date.now() - FRIEND_ROOM_TTL_MS) } },
  });
  if (expiredRooms) console.log(`[MatchEngine] expired ${expiredRooms} unjoined friend room(s)`);

  const stale = await prisma.match.findMany({
    where: { status: 'ONGOING', createdAt: { lt: new Date(Date.now() - STALE_MATCH_MS) } },
    select: { id: true },
  });
  for (const { id } of stale) {
    const hasDeadline = (await redis.zScore(DEADLINES_KEY, id)) != null;
    if (!hasDeadline && !(await getClock(id))) {
      console.log(`[MatchEngine] abandoning stale match ${id}`);
      await finalizeMatch(id, { abandoned: true });
    }
  }
}

export async function getLiveClock(matchId) {
  const clock = await getClock(matchId);
  return clock ? questionPayload(matchId, clock) : null;
}
