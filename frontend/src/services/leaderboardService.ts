import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const LeaderboardService = {

  getLeaderboard: async () => {
    const response = await api.get(`/leaderboard`);
    return response.data;
  },

};

export default LeaderboardService;
