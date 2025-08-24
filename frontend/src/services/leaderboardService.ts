import { createOptimizedService } from "./optimizedService";

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
  profilePic?: string;
}

// Use optimized service with caching
const leaderboardService = createOptimizedService<LeaderboardUser[]>({
  baseEndpoint: "/leaderboard",
  cacheTTL: 30000, // 30 seconds cache for leaderboard
  useMemoryCache: true,
});

const LeaderboardService = {
  getLeaderboard: async (): Promise<LeaderboardUser[]> => {
    const res = await leaderboardService.get("");
    // Handle both wrapped and unwrapped responses safely
    return Array.isArray(res) ? res : (res as any)?.data || [];
  },
};

export default LeaderboardService;
