import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export interface SaveQuestionPayload {
  userId: string;
  questionId: string;
  savedFrom?: 'BATTLE_RESULT' | 'SOLO_RESULT';
  userAnswer?: string;
  wasCorrect?: boolean;
}

const SavedQuestionsService = {
  // Toggle save/unsave a question
  toggleSave: async (payload: SaveQuestionPayload) => {
    const res = await api.post("/saved-questions/toggle", payload);
    return res.data;
  },

  // Check if multiple questions are saved (for result pages)
  checkMultipleSaved: async (userId: string, questionIds: string[]) => {
    const res = await api.post(`/saved-questions/check/${userId}`, { questionIds });
    return res.data;
  },

  // Get user's saved questions
  getSavedQuestions: async (userId: string, page = 1, limit = 20) => {
    const res = await api.get(`/saved-questions/${userId}?page=${page}&limit=${limit}`);
    return res.data;
  },
};

export default SavedQuestionsService;
