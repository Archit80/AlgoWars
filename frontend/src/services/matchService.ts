import api from "@/lib/apiClient";

// Simple in-memory cache for match data (shorter TTL since it's more dynamic)
const matchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10000; // 10 seconds for match data

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

export type BattleMode = "friend" | "random";


const MatchService = {
  createFriendMatch: async ({ topics, difficulty }: { topics: string[]; difficulty: string }) => {
    const res = await api.post("/match/friend", { topics, difficulty });
    return res.data;
  },
  joinByCode: async ({ roomCode }: { roomCode: string }) => {
    const res = await api.post("/match/join-by-code", { roomCode });
    console.log("Join by code response:", res.data);
    return res.data;
  },
  createOrJoinRandomMatch: async ({ topics, difficulty }: { topics: string[]; difficulty: string }) => {
    const res = await api.post("/match/random", { topics, difficulty });
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
  // Polling fallback for the waiting player in case the socket missed match:found
  getRandomStatus: async (): Promise<{ status: "matched" | "waiting"; matchId: string | null }> => {
    const res = await api.get("/match/random/status");
    return res.data;
  },
  leaveRandomQueue: async () => {
    const res = await api.delete("/match/random");
    return res.data;
  },
  submitAnswer: async (matchId: string, payload: { questionId: string; answer: string }) => {
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
  getResult: async (matchId: string) => {
    const res = await api.get(`/match/${matchId}/result`);
    return res.data;
  }
};

export default MatchService;
