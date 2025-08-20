import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket'],
    path: "/api/socket.io"
  });
  return socket;
}

export function joinMatchRoom(matchId: string) {
  const s = getSocket();
  s.emit('match:join', { matchId });
}

export function joinUserRoom(userId: string) {
  const s = getSocket();
  // Small delay to ensure socket is ready
  setTimeout(() => {
    console.log(`[Socket] Joining user room: ${userId}`);
    s.emit('user:join', { userId });
  }, 100);
}

export function leaveMatchRoom(matchId: string) {
  if (!socket) return;
  socket.emit('match:leave', { matchId });
}
