import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
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
    const res = await api.get(`/match/${matchId}/status`);
    return res.data;
  },
  getQuestions: async (matchId: string) => {
    const res = await api.get(`/match/${matchId}/questions`);
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
