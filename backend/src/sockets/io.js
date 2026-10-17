import { Server } from "socket.io";
import prisma from '../db/prismaClient.js';
import { authenticateSocket } from '../middlewares/auth.js';
import { socketRateLimit } from '../middlewares/rateLimit.js';
import { playerJoined, forfeitMatch } from '../services/matchEngine.js';

// Transport only: authenticates sockets, manages rooms, and hands match events to the engine.

// Grace period before forfeit on disconnect (handles brief network blips)
const DISCONNECT_GRACE_MS = 8000;
const disconnectTimers = new Map(); // `${userId}:${matchId}` -> timeout

let io;

export function getIO() {
  return io;
}

function isInRoom(roomId, userId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  return Boolean(room && [...room].some((sid) => io.sockets.sockets.get(sid)?.userId === userId));
}

export function initIO(httpServer, corsOrigin = "*") {
  io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/api/socket.io",
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.userId;
    let matchId = null;

    // Personal room for notifications such as match:found / match:started
    socket.join(userId);

    socket.on("match:join", async (data) => {
      try {
        if (!(await socketRateLimit(socket, 'match:join', 10, 60000))) return;
        if (!data?.matchId) return;

        // Only the two players may join a match room (joining arms the disconnect-forfeit)
        const match = await prisma.match.findUnique({
          where: { id: data.matchId },
          select: { user1Id: true, user2Id: true },
        });
        if (!match || (match.user1Id !== userId && match.user2Id !== userId)) {
          socket.emit('match:error', { matchId: data.matchId, error: 'Not a participant in this match' });
          return;
        }
        matchId = data.matchId;

        const graceKey = `${userId}:${matchId}`;
        if (disconnectTimers.has(graceKey)) {
          clearTimeout(disconnectTimers.get(graceKey));
          disconnectTimers.delete(graceKey);
        }

        socket.join(matchId);
        await playerJoined(matchId, userId, socket);
      } catch (err) {
        console.error('[Socket] match:join failed:', err);
      }
    });

    socket.on("match:leave", async ({ matchId: mId } = {}) => {
      if (!(await socketRateLimit(socket, 'match:leave', 10, 60000))) return;
      if (!mId) return;
      socket.leave(mId);
      if (matchId === mId) matchId = null;
    });

    socket.on("disconnect", () => {
      if (!matchId) return;
      const leftMatchId = matchId;
      const graceKey = `${userId}:${leftMatchId}`;
      const timeout = setTimeout(async () => {
        disconnectTimers.delete(graceKey);
        if (isInRoom(leftMatchId, userId)) return; // reconnected on another socket
        try {
          await forfeitMatch(leftMatchId, userId);
        } catch (err) {
          console.error(`[Socket] forfeit for ${graceKey} failed:`, err);
        }
      }, DISCONNECT_GRACE_MS);
      disconnectTimers.set(graceKey, timeout);
    });
  });

  console.log("✅ Socket.IO initialized (with auth middleware)");
  return io;
}
