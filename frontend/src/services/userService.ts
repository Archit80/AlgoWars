import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types based on the backend User schema
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
  email: string;
  username: string | null;
  xp: number;
  streak: number;
  soloSessions: SoloSession[];
  userAchievements: UserAchievement[];
  // Calculated fields from backend
  level: number;
  currentXP: number;
  xpToNext: number;
  totalXP: number;
  accuracy: number;
  battlesWon: number;
  totalBattles: number;
  stats: {
    totalSoloSessions: number;
    totalCorrectAnswers: number;
    totalQuestions: number;
    winRate: number;
  };
}

const UserService = {
  getUserData: async (userId: string): Promise<UserData> => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },
};

export default UserService;
