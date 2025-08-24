import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Simple in-memory cache for match data (shorter TTL since it's more dynamic)
const matchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10000; // 10 seconds for match data

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Cache helper functions
const getCached = (key: string) => {
  const cached = matchCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCache = (key: string, data: any) => {
  matchCache.set(key, { data, timestamp: Date.now() });
};

// Add auth interceptor to include Supabase JWT token
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Error getting auth session:', error);
  }
  return config;
});

export type BattleMode = "friend" | "random";


const MatchService = {
  createFriendMatch: async ({ userId, topics, difficulty }: { userId: string; topics: string[]; difficulty: string }) => {
    const res = await api.post("/match/friend", { userId, topics, difficulty });
    return res.data;
  },
  joinByCode: async ({ userId, roomCode }: { userId: string; roomCode: string }) => {
    const res = await api.post("/match/join-by-code", { userId, roomCode });
    console.log("Join by code response:", res.data);
    return res.data;
  },
  createOrJoinRandomMatch: async ({ userId, topics, difficulty, xp }: { userId: string; topics: string[]; difficulty: string; xp?: number }) => {
    const res = await api.post("/match/random", { userId, topics, difficulty, xp });
    return res.data;
  },
  getStatus: async (matchId: string) => {
    const cacheKey = `match_status_${matchId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const res = await api.get(`/match/${matchId}/status`);
    setCache(cacheKey, res.data);
    return res.data;
  },
  getQuestions: async (matchId: string) => {
    const cacheKey = `match_questions_${matchId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const res = await api.get(`/match/${matchId}/questions`);
    setCache(cacheKey, res.data);
    return res.data;
  },
  submitAnswer: async (matchId: string, payload: { userId: string; questionId: string; answer: string }) => {
    const res = await api.post(`/match/${matchId}/answer`, payload);
    return res.data;
  },
  getState: async (matchId: string) => {
    const res = await api.get(`/match/${matchId}/state`);
    return res.data;
  },
  getUsernames: async (matchId: string) => {
    const res = await api.get(`/match/${matchId}/usernames`);
    return res.data;
  },
  getResult: async (matchId: string, userId: string) => {
    const res = await api.get(`/match/${matchId}/result?userId=${userId}`);
    return res.data;
  }
};

export default MatchService;
