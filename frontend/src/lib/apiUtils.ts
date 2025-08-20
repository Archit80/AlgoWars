import { getSocket } from './socket';

// Add token to socket auth
export function authenticateSocket(token: string) {
  const socket = getSocket();
  socket.auth = { token };
  
  if (socket.connected) {
    socket.disconnect();
    socket.connect();
  }
}

// Enhanced error handling for API calls
export async function apiRequest(url: string, options: RequestInit = {}) {
  try {
    const token = localStorage.getItem('supabase.auth.token');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Loading state management
export class LoadingManager {
  private static states = new Map<string, boolean>();
  private static listeners = new Set<(states: Record<string, boolean>) => void>();

  static setLoading(key: string, loading: boolean) {
    this.states.set(key, loading);
    this.notify();
  }

  static isLoading(key: string): boolean {
    return this.states.get(key) || false;
  }

  static subscribe(listener: (states: Record<string, boolean>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify() {
    const states = Object.fromEntries(this.states);
    this.listeners.forEach(listener => listener(states));
  }
}
