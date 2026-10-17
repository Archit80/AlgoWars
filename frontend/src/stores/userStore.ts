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

  // Fetch profile + stats from the backend; concurrent callers share one request
  let inFlight: Promise<void> | null = null;
  const loadUserData = (userId: string) => {
    if (inFlight) return inFlight;
    inFlight = (async () => {
      try {
        const [userData, userStatsRaw] = await Promise.all([
          userService.getUserData(userId),
          userService.getUserStats(userId),
        ]);
        const raw = userStatsRaw as Partial<UserStats>;
        set({
          isOnboarded: userData.isOnboarded,
          userStats: {
            xp: raw?.xp ?? 0,
            level: raw?.level ?? 0,
            streak: raw?.streak ?? 0,
            totalBattles: raw?.totalBattles ?? 0,
            wins: raw?.wins ?? 0,
            losses: raw?.losses ?? 0,
            accuracy: raw?.accuracy ?? 0,
          },
          userDataFetched: true,
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        set({ userDataFetched: true });
      } finally {
        inFlight = null;
      }
    })();
    return inFlight;
  };

  // Singleton auth wiring (the store module can be evaluated more than once in dev)
  interface WindowWithAuthListener extends Window {
    __userStoreAuthListener?: boolean;
  }

  if (typeof window !== 'undefined' && !(window as WindowWithAuthListener).__userStoreAuthListener) {
    (window as WindowWithAuthListener).__userStoreAuthListener = true;

    // getSession reads the stored session locally (network only if the token needs refreshing),
    // so pages render right away. Backend data loads in the background, and only when missing.
    supabase.auth.getSession()
      .then(({ data }) => {
        const user = data?.session?.user ?? null;
        const state = useUserStore.getState();
        if (!user) {
          if (state.supabaseUser) state.clearUserData();
          set({ loading: false });
          return;
        }
        const sameUser = state.supabaseUser?.id === user.id;
        set({ supabaseUser: user, loading: false, ...(sameUser ? {} : { userDataFetched: false, isOnboarded: false }) });
        if (!sameUser || !state.userDataFetched) loadUserData(user.id);
      })
      .catch(() => set({ loading: false }));

    // Only react to real sign-in/sign-out changes; token refreshes don't refetch the profile.
    // (No awaiting inside this callback: supabase-js warns that it can deadlock.)
    supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      const state = useUserStore.getState();
      if (!user) {
        if (event === 'SIGNED_OUT' || state.supabaseUser) state.clearUserData();
        return;
      }
      if (state.supabaseUser?.id !== user.id) {
        // A different account signed in: drop the previous account's cached data
        set({ supabaseUser: user, userDataFetched: false, isOnboarded: false, loading: false });
        loadUserData(user.id);
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

    // Force a re-fetch, e.g. after onboarding or an OAuth callback
    refreshUser: async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user ?? null;
      set({ supabaseUser: user, loading: false });
      if (user?.id) await loadUserData(user.id);
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
