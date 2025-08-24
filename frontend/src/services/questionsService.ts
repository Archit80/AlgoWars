import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Simple in-memory cache for questions (longer TTL since questions don't change often)
const questionsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes for questions

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache helper functions
const getCached = (key: string) => {
  const cached = questionsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCache = (key: string, data: any) => {
  questionsCache.set(key, { data, timestamp: Date.now() });
};

const QuestionsService = {
  getQuestionsByCategory: async (categories: string[], mode: string, userId: string, difficulty: string, questionCount: number) => {
    try {
      // Create cache key from parameters
      const cacheKey = `questions_${categories.join('-')}_${mode}_${difficulty}_${questionCount}`;
      const cached = getCached(cacheKey);
      if (cached) {
        console.log("[API] Using cached questions for:", { categories, mode, difficulty, questionCount });
        return cached;
      }

      console.log("[API] Fetching questions by categories", { categories, mode, userId, difficulty, questionCount });
      const response = await api.get("/questions/get-solo", {
        params: { 
          categories: categories.join(','), 
          mode, 
          userId,
          difficulty,
          questionCount
        }
      });
      console.log("[API] Fetched questions response:", response.data);
      
      // Cache the response
      setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error("[API] Error fetching questions by categories:", error);
      throw error;
    }
  },
  endSoloSession: async ({ soloSessionId, score, total, duration, mode, questionResults }: { 
    soloSessionId: number, 
    score: number, 
    total: number, 
    duration?: number, 
    mode?: string,
    questionResults?: Array<{
      id: string;
      text: string;
      options: string[];
      correctAnswer: string;
      userAnswer: string | null;
      userCorrect: boolean;
    }>
  }) => {
    try {
      console.log("[API] Ending solo session", { soloSessionId, score, total, duration, mode, questionResults });
      const response = await api.post("/questions/end-solo-session", {
        soloSessionId,
        score,
        total,
        duration,
        mode,
        questionResults,
      });
      console.log("[API] Ended solo session response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[API] Error ending solo session:", error);
      throw error;
    }
  }
}

export default QuestionsService;