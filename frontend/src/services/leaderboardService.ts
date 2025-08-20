import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LeaderboardUser {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  totalMatches: number;
  matchesWon: number;
  matchesLost: number;
  correctAnswers: number;
  totalAnswers: number;
  winRate: number;
  accuracy: number;
}

const LeaderboardService = {

  getLeaderboard: async (): Promise<LeaderboardUser[]> => {
    const response = await api.get(`/leaderboard`);
    return response.data.data;
  },

};

export default LeaderboardService;
