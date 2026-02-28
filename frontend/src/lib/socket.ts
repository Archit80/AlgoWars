import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket'],
    path: "/api/socket.io",
    // Built-in reconnection with exponential backoff
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  // Global error logging
  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });

  // Socket.IO v4: reconnect events are on the Manager (socket.io), not the Socket
  socket.io.on('reconnect', (attemptNumber: number) => {
    console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
    // Re-join rooms on reconnect
    if (pendingUserRoom) {
      socket?.emit('user:join', { userId: pendingUserRoom });
    }
    if (pendingMatchRoom) {
      socket?.emit('match:join', { matchId: pendingMatchRoom });
    }
  });

  socket.io.on('reconnect_failed', () => {
    console.error('[Socket] Reconnection failed after all attempts');
  });

  return socket;
}

// Track rooms to rejoin on reconnect
let pendingUserRoom: string | null = null;
let pendingMatchRoom: string | null = null;

export function joinMatchRoom(matchId: string) {
  pendingMatchRoom = matchId;
  const s = getSocket();
  if (s.connected) {
    s.emit('match:join', { matchId });
  } else {
    // Queue the join for when connection is established
    s.once('connect', () => {
      s.emit('match:join', { matchId });
    });
  }
}

export function joinUserRoom(userId: string) {
  pendingUserRoom = userId;
  const s = getSocket();
  if (s.connected) {
    s.emit('user:join', { userId });
  } else {
    // Queue the join for when connection is established
    s.once('connect', () => {
      s.emit('user:join', { userId });
    });
  }
}

export function leaveMatchRoom(matchId: string) {
  pendingMatchRoom = null;
  if (!socket) return;
  socket.emit('match:leave', { matchId });
}
