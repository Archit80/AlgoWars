import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Simple in-memory cache for user data
const userCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache helper functions
const getCached = (key: string) => {
  const cached = userCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCache = (key: string, data: any) => {
  userCache.set(key, { data, timestamp: Date.now() });
};

// Types based on the backend User schema
export interface RecentBattle {
  winnerId?: string;
  user1Id: string;
  user2Id: string;
  user1?: { username: string };
  user2?: { username: string };
  user1Score: number;
  user2Score: number;
  createdAt: string;
}

interface SoloSession {
  id: number;
  totalQuestions: number;
  correctAnswers: number;
  duration?: number;
  mode: 'TIMED' | 'ACCURACY';
  difficulty: string;
  categories: string[];
  xpEarned: number;
  startedAt: string;
  endedAt?: string;
}

interface Achievement {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  description: string;
  goal: number;
  type: string;
}

interface UserAchievement {
  id: string | null;
  progress: number;
  unlocked: boolean;
  updatedAt: string | null;
  achievement: Achievement;
}

export interface UserData {
  id: string;
  email?: string;
  username: string | null;
  profilePic?: string;
  isOnboarded: boolean;
  xp?: number;
  currentXP: number;
  streak: number;
  longestStreak: number;
  level: number;
  tier?: number;
  tierName?: string;
  tierColor?: string;
  tierEmoji?: string;
  isAtMilestone?: boolean;
  soloSessions?: SoloSession[];
  userAchievements?: UserAchievement[];
  recentBattles?: RecentBattle[];
  totalMatches?: number;
  matchesWon?: number;
  matchesLost?: number;
  correctAnswers?: number;
  totalAnswers?: number;
  lastMatchAt?: string;
  currentLevelXP?: number;
  xpToNext?: number;
  totalXPForNextLevel?: number;
  xpRequiredForCurrentLevel?: number;
  progress?: number;
  savedQuestions?: any[];
  totalXP?: number;
  accuracy?: number;
  battlesWon?: number;
  totalBattles?: number;
  stats?: {
    totalSoloSessions: number;
    totalCorrectAnswers: number;
    totalQuestions: number;
    winRate: number;
  };
}

// New interface for fast stats endpoint
export interface UserStats {
  id: string;
  username: string | null;
  xp: number;
  streak: number;
  totalMatches: number;
  matchesWon: number;
  matchesLost: number;
  correctAnswers: number;
  totalAnswers: number;
  lastMatchAt?: string;
  // Derived stats
  winRate: number;
  accuracy: number;
  matchesDrawn: number;
}

// New interface for detailed level info endpoint
export interface UserLevelInfo {
  userId: string;
  username: string;
  totalXP: number;
  // Current level info
  level: number;
  currentLevelXP: number;
  xpRequiredForCurrentLevel: number;
  progress: number; // 0-100 percentage
  // Next level info
  xpToNext: number;
  totalXPForNextLevel: number;
  // Tier information
  tier: {
    level: number;
    name: string;
    color: string;
    emoji: string;
  };
  // Special status
  isAtMilestone: boolean;
  // Time estimates
  timeToNextLevel: {
    days: number;
    weeks: number;
    months: number;
  };
}

const UserService = {
  getUserData: async (userId: string): Promise<UserData> => {
    const cacheKey = `user_${userId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/user/${userId}`);
      const userData = response.data.data;
      setCache(cacheKey, userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },

  getUserDataByUsername: async (username: string): Promise<UserData> => {
    const cacheKey = `user_username_${username}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/user/username/${username}`);
      const userData = response.data.data;
      setCache(cacheKey, userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user data by username:', error);
      throw error;
    }
  },

  // PATCH onboarding info
  updateOnboarding: async (userId: string, data: { username: string; profilePic: string }) => {
    try {
      const response = await api.patch(`/user/${userId}/onboarding`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating onboarding:', error);
      throw error;
    }
  },

  // New fast stats endpoint using explicit counters
  getUserStats: async (userId: string): Promise<UserStats> => {
    const cacheKey = `user_stats_${userId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/user/${userId}/stats`);
      const userStats = response.data.stats;
      setCache(cacheKey, userStats);
      return userStats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  getUserStatsByUsername: async (username: string): Promise<UserStats> => {
    const cacheKey = `user_stats_username_${username}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/user/username/${username}/stats`);
      const userStats = response.data.stats;
      setCache(cacheKey, userStats);
      return userStats;
    } catch (error) {
      console.error('Error fetching user stats by username:', error);
      throw error;
    }
  },

  // New detailed level info endpoint
  getUserLevelInfo: async (userId: string): Promise<UserLevelInfo> => {
    try {
      const response = await api.get(`/user/${userId}/level`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user level info:', error);
      throw error;
    }
  },
};

export default UserService;
