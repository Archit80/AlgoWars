
import { create } from 'zustand';

export type Question = {
  id: string;
  text: string;
  options: string[];
  answer: string;
  type: string;
  categories: string[];
  difficulty: string;
};

export type UserAnswer = {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
};

export type PracticeStore = {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentIndex: number;
  mode: string | null;
  category: string | null;
  soloSessionId: number | null;
  setQuestions: (qs: Question[], soloSessionId?: number) => void;
  setMode: (mode: string) => void;
  setCategory: (category: string) => void;
  setSoloSessionId: (id: number) => void;
  submitAnswer: (questionId: string, selectedOption: string) => void;
  nextQuestion: () => void;
  reset: () => void;
};

export const usePracticeStore = create<PracticeStore>((set, get) => ({
  questions: [],
  userAnswers: [],
  currentIndex: 0,
  mode: null,
  category: null,
  soloSessionId: null,

  setQuestions: (qs, soloSessionId) => set({ questions: qs, userAnswers: [], currentIndex: 0, soloSessionId: soloSessionId ?? null }),
  setMode: (mode) => set({ mode }),
  setCategory: (category) => set({ category }),
  setSoloSessionId: (id) => set({ soloSessionId: id }),

  submitAnswer: (questionId, selectedOption) => {
    const question = get().questions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = question.answer === selectedOption;
    const alreadyAnswered = get().userAnswers.some((ua) => ua.questionId === questionId);
    if (alreadyAnswered) return;

    set((state) => ({
      userAnswers: [
        ...state.userAnswers,
        { questionId, selectedOption, isCorrect },
      ],
    }));
  },

  nextQuestion: () => {
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    }));
  },

  reset: () => set({ questions: [], userAnswers: [], currentIndex: 0, mode: null, category: null, soloSessionId: null }),
}));

export default usePracticeStore;