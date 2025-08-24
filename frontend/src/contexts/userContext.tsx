import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/lib/supabaseClient";

interface UserStats {
  xp: number;
  level: number;
  streak: number;
  totalBattles: number;
  wins: number;
  losses: number;
  accuracy: number;
}

interface UserContextType {
  supabaseUser: unknown;
  initialized: boolean;
  userStats: UserStats;
  updateXP: (xp: number) => void;
  updateStreak: (streak: number) => void;
  addBattleResult: (won: boolean) => void;
  updateAccuracy: (accuracy: number) => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<unknown | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 1250,
    level: 7,
    streak: 5,
    totalBattles: 23,
    wins: 15,
    losses: 8,
    accuracy: 82
  });

  // Fetch user from Supabase on mount
  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    setSupabaseUser(data?.user || null);
    // Optionally: fetch stats from your backend here using supabaseUser.id
  };

  useEffect(() => {
    // Fetch current session/user immediately so page reloads restore state
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSupabaseUser(sessionData?.session?.user || null);
      setInitialized(true);
    })();

    // Listen for auth state changes and clean up properly
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSupabaseUser(session?.user || null);
    });

    return () => {
      // authListener is a { subscription } object in older libs; handle both shapes
      if (authListener && (authListener as any).subscription) {
        (authListener as any).subscription.unsubscribe();
      } else if (authListener && typeof (authListener as any).unsubscribe === 'function') {
        (authListener as any).unsubscribe();
      }
    };
  }, []);

  const updateXP = (newXP: number) => {
    setUserStats(prev => {
      const totalXP = prev.xp + newXP;
      const newLevel = Math.floor(totalXP / 200) + 1;
      return { ...prev, xp: totalXP, level: newLevel };
    });
  };

  const updateStreak = (streak: number) => {
    setUserStats(prev => ({ ...prev, streak }));
  };

  const addBattleResult = (won: boolean) => {
    setUserStats(prev => ({
      ...prev,
      totalBattles: prev.totalBattles + 1,
      wins: won ? prev.wins + 1 : prev.wins,
      losses: won ? prev.losses : prev.losses + 1
    }));
  };

  const updateAccuracy = (accuracy: number) => {
    setUserStats(prev => ({ ...prev, accuracy }));
  };

    return (
    <UserContext.Provider value={{ supabaseUser, initialized, userStats, updateXP, updateStreak, addBattleResult, updateAccuracy, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};