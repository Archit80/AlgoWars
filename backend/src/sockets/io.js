import { Server } from "socket.io";
import prisma from '../db/prismaClient.js';
import { forfeitMatch } from '../controllers/match.controller.js';

const matchTimers = new Map(); // matchId -> timer state
const QUESTION_TIME = 60; // seconds per question
const TICK_RATE = 1000; // ms

async function loadMatchTimerState(matchId) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      status: true,
      currentIndex: true,
      user1Id: true,
      user2Id: true,
      questions: { select: { id: true } },
    },
  });

  if (!match || match.status !== 'ONGOING') return null;

  return {
    timeLeft: QUESTION_TIME,
    currentIndex: match.currentIndex,
    skipped: {},
  };
}

function stopTimer(matchId) {
  const entry = matchTimers.get(matchId);
  if (entry) clearInterval(entry.interval);
  matchTimers.delete(matchId);
}

async function handleQuestionTimeout(io, matchId, state) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      status: true,
      currentIndex: true,
      user1Id: true,
      user2Id: true,
      questions: { select: { id: true } },
    },
  });

  if (!match || match.status !== 'ONGOING') {
    stopTimer(matchId);
    return;
  }

  const currentQuestion = match.questions[match.currentIndex];
  if (!currentQuestion) {
    stopTimer(matchId);
    return;
  }

  const answers = await prisma.matchAnswer.findMany({
    where: { matchId, questionId: currentQuestion.id },
    select: { userId: true },
  });

  const answeredUsers = new Set(answers.map((a) => a.userId));
  [match.user1Id, match.user2Id].forEach((uid) => {
    if (!uid) return;
    const answered = answeredUsers.has(uid);
    state.skipped[uid] = answered ? 0 : (state.skipped[uid] || 0) + 1;
    if (state.skipped[uid] >= 2) {
      forfeitMatch(matchId, uid);
      state.skipped[uid] = 0;
    }
  });

  if (match.currentIndex + 1 < match.questions.length) {
    const nextIndex = match.currentIndex + 1;

    await prisma.match.update({
      where: { id: matchId },
      data: { currentIndex: nextIndex },
    });

    state.currentIndex = nextIndex;
    state.timeLeft = QUESTION_TIME;

    io.to(matchId).emit('match:state', { matchId, currentIndex: nextIndex });
    return;
  }

  if (answers.length === 2) {
    await prisma.match.update({ where: { id: matchId }, data: { status: 'COMPLETED' } });
    const final = await prisma.match.findUnique({
      where: { id: matchId },
      select: { user1Score: true, user2Score: true, winnerId: true },
    });

    io.to(matchId).emit('match:completed', {
      matchId,
      user1Score: final.user1Score,
      user2Score: final.user2Score,
      winnerId: final.winnerId,
    });

    stopTimer(matchId);
    setTimeout(() => cleanupMatch(matchId), 3000);
  }
}

async function tickMatch(io, matchId) {
  const state = matchTimers.get(matchId);
  if (!state) return;

  state.timeLeft = Math.max(0, state.timeLeft - 1);
  io.to(matchId).emit('match:timer', { matchId, timeLeft: state.timeLeft });

  if (state.timeLeft === 0) {
    await handleQuestionTimeout(io, matchId, state);
  }
}

async function startTimer(ioInstance, matchId) {
  if (!ioInstance || matchTimers.has(matchId)) return;

  const state = await loadMatchTimerState(matchId);
  if (!state) return;

  const interval = setInterval(() => {
    tickMatch(ioInstance, matchId).catch((error) => {
      console.error(`[Timer] Error in match ${matchId}:`, error);
    });
  }, TICK_RATE);

  matchTimers.set(matchId, { ...state, interval });
}

export function cleanupMatch(matchId) {
  try {
    stopTimer(matchId);

    if (io) {
      const room = io.sockets.adapter.rooms.get(matchId);
      if (room) {
        room.forEach((socketId) => {
          const socket = io.sockets.sockets.get(socketId);
          if (socket) socket.leave(matchId);
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

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    let userId = null;
    let matchId = null;

    socket.on("user:join", (data) => {
      if (!data?.userId) return;
      userId = data.userId;
      socket.join(userId);
      console.log(`[Socket] User ${userId} joined room. Socket: ${socket.id}`);
    });

    socket.on("match:join", async (data) => {
      if (!data?.matchId) return;
      matchId = data.matchId;
      socket.join(matchId);
      io.to(matchId).emit("match:joined", { ts: Date.now() });
      await startTimer(io, matchId);
    });

    socket.on("match:next", ({ matchId: roomId, index }) => {
      if (!roomId || index == null) return;
      io.to(roomId).emit("match:state", { matchId: roomId, index });
    });

    socket.on("match:timerSync", ({ matchId: roomId, timeLeft }) => {
      if (!roomId || timeLeft == null) return;
      socket.to(roomId).emit("match:timer", { timeLeft });
    });

    socket.on("match:leave", ({ matchId: roomId }) => {
      if (!roomId) return;
      socket.leave(roomId);
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);
      if (userId && matchId) {
        await forfeitMatch(matchId, userId);
      }
    });
  });

  console.log("✅ Socket.IO initialized");
  return io;
}

export function emitMatchReveal(matchId, questionId) {
  try {
    getIO().to(matchId).emit('match:reveal', { matchId, questionId });
  } catch {
    // no-op
  }
}

export function ensureMatchTimer(matchId) {
  startTimer(getIO(), matchId).catch(() => {
    // no-op
  });
}

export function resetMatchTimer(matchId) {
  const state = matchTimers.get(matchId);
  if (state) {
    state.timeLeft = QUESTION_TIME;
  }
}
