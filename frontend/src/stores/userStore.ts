import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from "@/lib/supabaseClient";
import userService from "@/services/userService";

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
  isOnboarded: boolean;
  userDataFetched: boolean;
  updateXP: (xp: number) => void;
  updateStreak: (streak: number) => void;
  addBattleResult: (won: boolean) => void;
  updateAccuracy: (accuracy: number) => void;
  refreshUser: () => Promise<void>;
  setSupabaseUser: (user: any) => void;
  setIsOnboarded: (onboarded: boolean) => void;
  clearUserData: () => void;
  loading: boolean;
}


export const useUserStore = create<UserStore>()(
  persist(
    (set) => {
      const initialState = {
        supabaseUser: null,
        isOnboarded: false,
        userDataFetched: false,
        userStats: {
          xp: 0,
          level: 0,
          streak: 0,
          totalBattles: 0,
          wins: 0,
          losses: 0,
          accuracy: 0,
        },
        loading: true,
      };

  // Listen for auth state changes (singleton pattern)
  // Extend Window type to include __userStoreAuthListener
  interface WindowWithAuthListener extends Window {
    __userStoreAuthListener?: boolean;
  }

  if (typeof window !== 'undefined' && !(window as WindowWithAuthListener).__userStoreAuthListener) {
    (window as WindowWithAuthListener).__userStoreAuthListener = true;
    
    // Initial auth check
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data?.user || null;
      const currentState = useUserStore.getState();
      
      set({ supabaseUser: user });
      
      // Only fetch user data if not already fetched and persisted
      if (user?.id && !currentState.userDataFetched) {
        try {
          const userData = await userService.getUserData(user.id);
          set({ isOnboarded: userData.isOnboarded, userDataFetched: true, loading: false });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          set({ userDataFetched: true, loading: false });
        }
      } else {
        set({ loading: false });
      }
    });
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null;
      const { clearUserData } = useUserStore.getState();
      
      if (user?.id) {
        set({ supabaseUser: user });
        try {
          const userData = await userService.getUserData(user.id);
          set({ isOnboarded: userData.isOnboarded, userDataFetched: true, loading: false });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          set({ userDataFetched: true, loading: false });
        }
      } else {
        // Clear all user data when user logs out
        clearUserData();
      }
    });
  }

  return {
    ...initialState,

    setSupabaseUser: (user) => set({ supabaseUser: user }),

    setIsOnboarded: (onboarded: boolean) => set({ isOnboarded: onboarded }),

    clearUserData: () => set({
      supabaseUser: null,
      isOnboarded: false,
      userDataFetched: false,
      userStats: {
        xp: 0,
        level: 0,
        streak: 0,
        totalBattles: 0,
        wins: 0,
        losses: 0,
        accuracy: 0,
      },
      loading: false,
    }),

    refreshUser: async () => {
      const { data } = await supabase.auth.getUser();
      set({ supabaseUser: data?.user || null, loading: false });
      
      // Fetch user data from backend to get isOnboarded status
      if (data?.user?.id) {
        try {
          const userData = await userService.getUserData(data.user.id);
          set({ isOnboarded: userData.isOnboarded, userDataFetched: true });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
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
},
{
  name: 'user-store',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    supabaseUser: state.supabaseUser,
    isOnboarded: state.isOnboarded,
    userDataFetched: state.userDataFetched,
    userStats: state.userStats,
    // Don't persist loading state
  }),
}
)
);
