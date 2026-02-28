import { Server } from "socket.io";
import prisma from '../db/prismaClient.js';
import { forfeitMatch } from '../controllers/match.controller.js';
import { authenticateSocket } from '../middlewares/auth.js';
import { socketRateLimit } from '../middlewares/rateLimit.js';

// ── In-memory match state cache ──────────────────────────────────────────
// This is the SINGLE authoritative in-memory store for match timer state.
// Avoids querying the DB on every tick.
const matchTimers = new Map(); // matchId -> { interval, timeLeft, skipped, matchCache }
const QUESTION_TIME = 60; // seconds per question
const TICK_RATE = 1000; // ms

// Grace period before forfeit on disconnect (handles brief network blips)
const DISCONNECT_GRACE_MS = 8000;
const disconnectTimers = new Map(); // `${userId}:${matchId}` -> timeout

function stopTimer(matchId) {
  const entry = matchTimers.get(matchId);
  if (entry) clearInterval(entry.interval);
  matchTimers.delete(matchId);
}

// Cache the match data when starting a timer so we don't query DB every tick
async function loadMatchCache(matchId) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { questions: true },
  });
  if (!match) return null;
  return {
    id: match.id,
    status: match.status,
    user1Id: match.user1Id,
    user2Id: match.user2Id,
    currentIndex: match.currentIndex,
    questionIds: match.questions.map(q => q.id),
    totalQuestions: match.questions.length,
    user1Score: match.user1Score,
    user2Score: match.user2Score,
  };
}

// Update the cached match data (called when state changes, like advancing questions)
export function updateMatchCache(matchId, updates) {
  const state = matchTimers.get(matchId);
  if (state?.matchCache) {
    Object.assign(state.matchCache, updates);
  }
}

async function tickMatch(io, matchId) {
  const state = matchTimers.get(matchId);
  if (!state || !state.matchCache) return;

  const cache = state.matchCache;

  // Check if match is still valid (only hit DB occasionally for status check)
  if (cache.status !== 'ONGOING') {
    stopTimer(matchId);
    return;
  }

  state.timeLeft -= 1;
  if (state.timeLeft < 0) state.timeLeft = 0;
  io.to(matchId).emit('match:timer', { matchId, timeLeft: state.timeLeft });

  if (state.timeLeft === 0) {
    // Timer expired for current question — query DB only now
    const currentQuestionId = cache.questionIds[cache.currentIndex];
    if (!currentQuestionId) return;

    const answers = await prisma.matchAnswer.findMany({
      where: { matchId, questionId: currentQuestionId },
    });

    if (cache.currentIndex + 1 < cache.totalQuestions) {
      // Track skipped questions per user
      state.skipped = state.skipped || {};
      [cache.user1Id, cache.user2Id].forEach(uid => {
        if (!uid) return;
        const answered = answers.some(a => a.userId === uid);
        state.skipped[uid] = (state.skipped[uid] || 0) + (answered ? 0 : 1);
        if (state.skipped[uid] >= 2) {
          forfeitMatch(matchId, uid);
          state.skipped[uid] = 0;
        }
      });

      const newIndex = cache.currentIndex + 1;
      await prisma.match.update({
        where: { id: matchId },
        data: { currentIndex: newIndex },
      });
      // Update cache
      cache.currentIndex = newIndex;
      state.timeLeft = QUESTION_TIME;
      io.to(matchId).emit('match:state', { matchId, currentIndex: newIndex });
    } else {
      // Last question — complete only if both answered
      if (answers.length === 2) {
        await prisma.match.update({
          where: { id: matchId },
          data: { status: 'COMPLETED' },
        });
        cache.status = 'COMPLETED';
        const final = await prisma.match.findUnique({ where: { id: matchId } });
        io.to(matchId).emit('match:completed', {
          matchId,
          user1Score: final.user1Score,
          user2Score: final.user2Score,
          winnerId: final.winnerId,
        });
        stopTimer(matchId);
        setTimeout(() => cleanupMatch(matchId), 3000);
        return;
      }
      // Otherwise, wait for both users to submit
    }
  }
}

async function startTimer(io, matchId) {
  if (matchTimers.has(matchId)) return;

  // Load match into memory cache ONCE
  const matchCache = await loadMatchCache(matchId);
  if (!matchCache || matchCache.status !== 'ONGOING') return;

  const data = { timeLeft: QUESTION_TIME, matchCache };
  const interval = setInterval(() => tickMatch(io, matchId), TICK_RATE);
  matchTimers.set(matchId, { ...data, interval });
}

export function cleanupMatch(matchId) {
  try {
    stopTimer(matchId);

    if (io) {
      const room = io.sockets.adapter.rooms.get(matchId);
      if (room) {
        room.forEach(socketId => {
          const socket = io.sockets.sockets.get(socketId);
          if (socket) {
            socket.leave(matchId);
          }
        });
      }
    }

    console.log(`[Cleanup] Match ${matchId} cleaned up`);
  } catch (error) {
    console.error(`[Cleanup] Failed to cleanup match ${matchId}:`, error);
  }
}

let io;

export function getIO() {
  return io;
}

export function initIO(httpServer, corsOrigin = "*") {
  io = new Server(httpServer, {
    cors: {
      origin: Array.isArray(corsOrigin) ? corsOrigin : corsOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/api/socket.io",
  });

  // ── Wire authentication middleware ──────────────────────────────────
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, "userId:", socket.userId);

    // userId comes from auth middleware; matchId tracked per-session
    let userId = socket.userId || null;
    let matchId = null;

    // Auto-join user room using authenticated userId
    if (userId) {
      socket.join(userId);
    }

    socket.on("user:join", async (data) => {
      if (!(await socketRateLimit(socket, 'user:join', 5, 60000))) return;
      if (!data?.userId) return;
      // Only allow joining own room (verified via auth)
      if (socket.userId && data.userId !== socket.userId) return;
      userId = data.userId;
      socket.join(userId);
      console.log(`[Socket] User ${userId} joined their room. Socket: ${socket.id}`);
    });

    socket.on("match:join", async (data) => {
      if (!(await socketRateLimit(socket, 'match:join', 10, 60000))) return;
      if (!data?.matchId) return;
      matchId = data.matchId;

      // Cancel any pending disconnect forfeit for this user+match
      const graceKey = `${userId}:${matchId}`;
      if (disconnectTimers.has(graceKey)) {
        clearTimeout(disconnectTimers.get(graceKey));
        disconnectTimers.delete(graceKey);
        console.log(`[Socket] Reconnect: cancelled forfeit for ${graceKey}`);
      }

      socket.join(matchId);
      io.to(matchId).emit("match:joined", { ts: Date.now() });
      await startTimer(io, matchId);
    });

    socket.on("match:next", async ({ matchId: mId, index }) => {
      if (!(await socketRateLimit(socket, 'match:next', 10, 60000))) return;
      if (!mId || index == null) return;
      io.to(mId).emit("match:state", { matchId: mId, index });
    });

    socket.on("match:timerSync", async ({ matchId: mId, timeLeft }) => {
      if (!(await socketRateLimit(socket, 'match:timerSync', 60, 60000))) return;
      if (!mId || timeLeft == null) return;
      socket.to(mId).emit("match:timer", { timeLeft });
    });

    socket.on("match:leave", async ({ matchId: mId }) => {
      if (!(await socketRateLimit(socket, 'match:leave', 10, 60000))) return;
      if (!mId) return;
      socket.leave(mId);
      if (matchId === mId) matchId = null;
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);

      // Grace period: don't forfeit immediately on transient disconnects
      if (userId && matchId) {
        const graceKey = `${userId}:${matchId}`;
        const timeout = setTimeout(async () => {
          disconnectTimers.delete(graceKey);
          // Check if user reconnected to the match room
          const room = io.sockets.adapter.rooms.get(matchId);
          const userSockets = io.sockets.adapter.rooms.get(userId);
          const reconnected = room && userSockets;
          if (!reconnected) {
            console.log(`[Socket] Grace period expired for ${graceKey}, forfeiting`);
            await forfeitMatch(matchId, userId);
          }
        }, DISCONNECT_GRACE_MS);
        disconnectTimers.set(graceKey, timeout);
      }
    });
  });

  console.log("✅ Socket.IO initialized (with auth middleware)");
  return io;
}

export function emitMatchReveal(matchId, questionId) {
  try {
    getIO().to(matchId).emit('match:reveal', { matchId, questionId });
  } catch {}
}

export function ensureMatchTimer(matchId) {
  try {
    startTimer(getIO(), matchId);
  } catch {}
}

export function resetMatchTimer(matchId) {
  try {
    const state = matchTimers.get(matchId);
    if (state) {
      state.timeLeft = QUESTION_TIME;
    }
  } catch {}
}
