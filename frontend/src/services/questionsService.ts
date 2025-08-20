import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


const QuestionsService = {
  getQuestionsByCategory: async (categories: string[], mode: string, userId: string, difficulty: string, questionCount: number) => {
    try {
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