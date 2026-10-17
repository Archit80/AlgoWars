import { io, Socket } from 'socket.io-client';
import { supabase } from '@/lib/supabaseClient';

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    autoConnect: true,
    // Called on every (re)connect, so the server always gets a fresh access token
    auth: (cb) => {
      supabase.auth.getSession()
        .then(({ data: { session } }) => cb({ token: session?.access_token }))
        .catch(() => cb({}));
    },
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
    // Re-join the match room on reconnect (the server re-adds the personal room itself)
    if (pendingMatchRoom) {
      socket?.emit('match:join', { matchId: pendingMatchRoom });
    }
  });

  // A handshake rejected by the server's auth middleware is not retried automatically;
  // connect again once a session exists.
  supabase.auth.onAuthStateChange((event) => {
    if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && socket && !socket.connected) {
      socket.connect();
    }
  });

  socket.io.on('reconnect_failed', () => {
    console.error('[Socket] Reconnection failed after all attempts');
  });

  return socket;
}

// Track the match room to rejoin on reconnect
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

export function leaveMatchRoom(matchId: string) {
  pendingMatchRoom = null;
  if (!socket) return;
  socket.emit('match:leave', { matchId });
}
