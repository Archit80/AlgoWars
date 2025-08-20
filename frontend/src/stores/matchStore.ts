import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper: never persist the label "You"; trim other usernames
const cleanUsername = (v?: string) => {
  if (!v) return undefined;
  const trimmed = v.trim();
  return trimmed.toLowerCase() === 'you' ? undefined : trimmed;
};

export interface MatchData {
  matchId: string;
  user1Id: string;
  user2Id: string;
  user1Username?: string;
  user2Username?: string;
  user1Score?: number;
  user2Score?: number;
  currentIndex?: number;
  status?: string;
  roomCode?: string;
}

export interface MatchStore {
  currentMatch: MatchData | null;
  setMatchData: (matchData: MatchData) => void;
  updateMatchData: (updates: Partial<MatchData>) => void;
  clearMatch: () => void;
  getUsernames: () => { user1Username?: string; user2Username?: string } | null;
}

export const useMatchStore = create<MatchStore>()(
  persist(
    (set, get) => ({
      currentMatch: null,

      setMatchData: (matchData: MatchData) => {
        console.log('Setting match data in store:', matchData);
        // sanitize usernames before persisting
        const cleaned: MatchData = {
          ...matchData,
          user1Username: cleanUsername(matchData.user1Username),
          user2Username: cleanUsername(matchData.user2Username),
        };
        set({ currentMatch: cleaned });
      },

      updateMatchData: (updates: Partial<MatchData>) => {
        set((state) => {
          if (!state.currentMatch) {
            // If there's no current match, we can't update it.
            return { currentMatch: null };
          }
          // sanitize incoming username updates
          const incomingUser1 = updates.user1Username !== undefined ? cleanUsername(updates.user1Username) : undefined;
          const incomingUser2 = updates.user2Username !== undefined ? cleanUsername(updates.user2Username) : undefined;

          // Create a new object for the updated match data
          const updatedMatch: MatchData = {
            ...state.currentMatch,
            ...updates,
            // preserve previous usernames if sanitized update is undefined
            user1Username: incomingUser1 ?? state.currentMatch.user1Username,
            user2Username: incomingUser2 ?? state.currentMatch.user2Username,
          };

          return { currentMatch: updatedMatch };
        });
      },

      clearMatch: () => {
        set({ currentMatch: null });
      },

      getUsernames: () => {
        const match = get().currentMatch;
        if (!match) return null;
        return {
          user1Username: match.user1Username,
          user2Username: match.user2Username,
        };
      },
    }),
    {
      name: 'match-storage', // localStorage key
      version: 2,
      migrate: (persistedState: { currentMatch?: Partial<MatchData> } | undefined) => {
        // Clean any stored "You" values on upgrade
        const state = persistedState ? { ...persistedState } : {} as { currentMatch?: Partial<MatchData> };
        const cm = state.currentMatch;
        if (cm) {
          state.currentMatch = {
            ...cm,
            user1Username: cleanUsername(cm.user1Username),
            user2Username: cleanUsername(cm.user2Username),
          };
        }
  return state;
      },
      partialize: (state) => ({
        currentMatch: state.currentMatch,
      }),
    }
  )
);
