import { create } from 'zustand';
import { supabase } from "@/lib/supabaseClient";

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  totalBattles: number;
  wins: number;
  losses: number;
  accuracy: number;
}

export interface UserStore {
  supabaseUser: any;
  userStats: UserStats;
  updateXP: (xp: number) => void;
  updateStreak: (streak: number) => void;
  addBattleResult: (won: boolean) => void;
  updateAccuracy: (accuracy: number) => void;
  refreshUser: () => Promise<void>;
  setSupabaseUser: (user: any) => void;
}


export const useUserStore = create<UserStore>((set, get) => {
  // Initial state
  const initialState = {
    supabaseUser: null,
    userStats: {
      xp: 1250,
      level: 7,
      streak: 5,
      totalBattles: 23,
      wins: 15,
      losses: 8,
      accuracy: 82,
    },
  };

  // Listen for auth state changes (singleton pattern)
  if (typeof window !== 'undefined' && !(window as any).__userStoreAuthListener) {
    (window as any).__userStoreAuthListener = true;
    supabase.auth.getUser().then(({ data }) => {
      set({ supabaseUser: data?.user || null });
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ supabaseUser: session?.user || null });
    });
  }

  return {
    ...initialState,

    setSupabaseUser: (user) => set({ supabaseUser: user }),

    refreshUser: async () => {
      const { data } = await supabase.auth.getUser();
      set({ supabaseUser: data?.user || null });
      // Optionally: fetch stats from your backend here using data?.user?.id
    },

    updateXP: (newXP: number) => {
      set((state) => {
        const totalXP = state.userStats.xp + newXP;
        const newLevel = Math.floor(totalXP / 200) + 1;
        return {
          userStats: { ...state.userStats, xp: totalXP, level: newLevel },
        };
      });
    },

    updateStreak: (streak: number) => {
      set((state) => ({ userStats: { ...state.userStats, streak } }));
    },

    addBattleResult: (won: boolean) => {
      set((state) => ({
        userStats: {
          ...state.userStats,
          totalBattles: state.userStats.totalBattles + 1,
          wins: won ? state.userStats.wins + 1 : state.userStats.wins,
          losses: won ? state.userStats.losses : state.userStats.losses + 1,
        },
      }));
    },

    updateAccuracy: (accuracy: number) => {
      set((state) => ({ userStats: { ...state.userStats, accuracy } }));
    },
  };
});
