import { Server } from "socket.io";
import prisma from '../db/prismaClient.js';
import { forfeitMatch } from '../controllers/match.controller.js';

// Simple in-memory timer registry
const matchTimers = new Map(); // matchId -> { interval, lastIndex }
const QUESTION_TIME = 60; // seconds per question
const TICK_RATE = 1000; // ms

async function tickMatch(io, matchId) {
  const match = await prisma.match.findUnique({ where: { id: matchId }, include: { questions: true } });
  if (!match || match.status !== 'ONGOING') {
    stopTimer(matchId);
    return;
  }
  const state = matchTimers.get(matchId);
  if (!state) return;

  state.timeLeft -= 1;
  if (state.timeLeft < 0) state.timeLeft = 0;
  io.to(matchId).emit('match:timer', { matchId, timeLeft: state.timeLeft });

  if (state.timeLeft === 0) {
    // Check for users who have skipped 2 consecutive questions
    // We'll use matchAnswers to count skips per user
    const currentQuestion = match.questions[match.currentIndex];
    if (currentQuestion) {
      const answers = await prisma.matchAnswer.findMany({ where: { matchId, questionId: currentQuestion.id } });
      // If not both answered, advance or forfeit
      if (match.currentIndex + 1 < match.questions.length) {
        // Track skipped questions per user in state
        state.skipped = state.skipped || {};
        [match.user1Id, match.user2Id].forEach(uid => {
          if (!uid) return;
          const answered = answers.some(a => a.userId === uid);
          state.skipped[uid] = (state.skipped[uid] || 0) + (answered ? 0 : 1);
          // If skipped 2 in a row, forfeit
          if (state.skipped[uid] >= 2) {
            forfeitMatch(matchId, uid);
            state.skipped[uid] = 0; // Reset after forfeit
          }
        });
        await prisma.match.update({ where: { id: matchId }, data: { currentIndex: match.currentIndex + 1 } });
        state.timeLeft = QUESTION_TIME;
        io.to(matchId).emit('match:state', { matchId, currentIndex: match.currentIndex + 1 });
      } else {
        // Only complete if both users have answered the last question
        if (answers.length === 2) {
          await prisma.match.update({ where: { id: matchId }, data: { status: 'COMPLETED' } });
          const final = await prisma.match.findUnique({ where: { id: matchId } });
          io.to(matchId).emit('match:completed', { matchId, user1Score: final.user1Score, user2Score: final.user2Score, winnerId: final.winnerId });
          stopTimer(matchId);
          setTimeout(() => cleanupMatch(matchId), 3000);
          return;
        }
        // Otherwise, wait for both users to submit
      }
    }
  }
}

function startTimer(io, matchId) {
  if (matchTimers.has(matchId)) return;
  const data = { timeLeft: QUESTION_TIME };
  const interval = setInterval(() => tickMatch(io, matchId), TICK_RATE);
  matchTimers.set(matchId, { ...data, interval });
}

function stopTimer(matchId) {
  const entry = matchTimers.get(matchId);
  if (entry) clearInterval(entry.interval);
  matchTimers.delete(matchId);
}

export function cleanupMatch(matchId) {
  try {
    // Stop timer
    stopTimer(matchId);
    
    // Clear any remaining socket rooms
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
      credentials: true
    },
    path: "/api/socket.io", 
  });


  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Track userId and matchId for disconnect handling
    let userId = null;
    let matchId = null;

    socket.on("user:join", (data) => {
      if (!data?.userId) return;
      userId = data.userId;
      socket.join(userId);
      console.log(`[Socket] User ${userId} joined their room. Socket: ${socket.id}. Room size: ${io.sockets.adapter.rooms.get(userId)?.size || 0}`);
    });

    socket.on("match:join", (data) => {
      if (!data?.matchId) return;
      matchId = data.matchId;
      socket.join(matchId);
      io.to(matchId).emit("match:joined", { ts: Date.now() });
      startTimer(io, matchId);
    });

    socket.on("match:next", ({ matchId, index }) => {
      if (!matchId || index == null) return;
      io.to(matchId).emit("match:state", { matchId, index });
    });

    socket.on("match:timerSync", ({ matchId, timeLeft }) => {
      if (!matchId || timeLeft == null) return;
      socket.to(matchId).emit("match:timer", { timeLeft });
    });

    socket.on("match:leave", ({ matchId }) => {
      if (!matchId) return;
      socket.leave(matchId);
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);
      // If user was in a match, forfeit
      if (userId && matchId) {
        await forfeitMatch(matchId, userId);
      }
    });
  });

  console.log("✅ Socket.IO initialized");
  return io;
}

export function emitMatchReveal(matchId, questionId) {
  try { getIO().to(matchId).emit('match:reveal', { matchId, questionId }); } catch {}
}

export function ensureMatchTimer(matchId) {
  try { startTimer(getIO(), matchId); } catch {}
}

export function resetMatchTimer(matchId) {
  try { 
    const state = matchTimers.get(matchId);
    if (state) {
      state.timeLeft = QUESTION_TIME;
    }
  } catch {}
}
