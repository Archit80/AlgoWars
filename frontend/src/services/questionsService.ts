import api from "@/lib/apiClient";

const QuestionsService = {
  getQuestionsByCategory: async (categories: string[], mode: string, userId: string, difficulty: string, questionCount: number) => {
    try {
      console.log("[API] Fetching questions by categories", { categories, mode, userId, difficulty, questionCount });
      const response = await api.get("/questions/get-solo", {
        params: { 
          categories: categories.join(','), 
          mode, 
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
  // The server grades the answers and computes score, duration and XP
  endSoloSession: async ({ soloSessionId, answers }: {
    soloSessionId: number;
    answers: Array<{ questionId: string; answer: string }>;
  }) => {
    try {
      const response = await api.post("/questions/end-solo-session", { soloSessionId, answers });
      return response.data;
    } catch (error) {
      console.error("[API] Error ending solo session:", error);
      throw error;
    }
  }
}

export default QuestionsService;