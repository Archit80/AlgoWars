"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import { Users, ArrowLeft } from "lucide-react";
import { getSocket } from "@/lib/socket";
import MatchService from "@/services/matchService";
import { useUserStore } from "@/stores/userStore";
import { useMatchStore } from "@/stores/matchStore";

export default function RandomWaitingRoom() {
  const { supabaseUser } = useUser();
  const router = useRouter();
  const { userStats } = useUserStore();
  const { setMatchData } = useMatchStore();
  const username = (supabaseUser as any)?.user_metadata?.username;
  const [waitingTime, setWaitingTime] = useState(0);
  const [status, setStatus] = useState("Searching for peer...");
  const [timedOut, setTimedOut] = useState(false);

  // Route protection
  useEffect(() => {
    if (!supabaseUser) {
      router.push("/login");
    }
  }, [supabaseUser, router]);

  // Separate useEffect for timer - runs once and doesn't depend on changing user metadata
  useEffect(() => {
    console.log('[Random Waiting] Starting timer');
    const timer = setInterval(() => {
      setWaitingTime(prev => prev + 1);
    }, 1000);

    return () => {
      console.log('[Random Waiting] Cleaning up timer');
      clearInterval(timer);
    };
  }, []); // Empty dependency array - timer runs independently

  const matchedRef = React.useRef(false);

  // Wait for match:found; poll as a fallback in case the socket missed the event
  useEffect(() => {
    const userId = (supabaseUser as { id?: string } | null)?.id;
    if (!userId || timedOut) return;

    const goToMatch = (matchId: string, opponent?: { userId: string; username: string }) => {
      if (matchedRef.current) return;
      matchedRef.current = true;
      setStatus("Match found! Redirecting...");
      // The waiting player is always user1; the play page backfills anything missing here
      setMatchData({
        matchId,
        user1Id: userId,
        user2Id: opponent?.userId ?? "",
        user1Username: username,
        user2Username: opponent?.username,
        user1Score: 0,
        user2Score: 0,
        currentIndex: 0,
        status: "ONGOING",
      });
      setTimeout(() => router.push(`/battle/play/${matchId}`), 1000);
    };

    const socket = getSocket();
    const onMatchFound = (data: { matchId: string; opponent: { userId: string; username: string } }) =>
      goToMatch(data.matchId, data.opponent);
    socket.on("match:found", onMatchFound);

    const poll = setInterval(async () => {
      try {
        const res = await MatchService.getRandomStatus();
        if (res.status === "matched" && res.matchId) goToMatch(res.matchId);
      } catch {
        // transient; next poll retries
      }
    }, 3000);

    return () => {
      socket.off("match:found", onMatchFound);
      clearInterval(poll);
    };
  }, [router, supabaseUser, setMatchData, username, timedOut]);

  // Timeout logic: after 90s without match, show fallback UI and leave the queue
  useEffect(() => {
    if (!timedOut && waitingTime >= 90 && !matchedRef.current) {
      setTimedOut(true);
      setStatus('No player(s) found.');
      MatchService.leaveRandomQueue().catch(() => {});
    }
  }, [waitingTime, timedOut]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
      <div className="max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              type="button"
              className="absolute top-6 left-6 p-3 bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
              onClick={() => {
                if (!matchedRef.current) MatchService.leaveRandomQueue().catch(() => {});
                router.push('/battle');
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

          </div>
          <div className="section-label mb-1">Matchmaking</div>
          <h1 className="text-3xl font-bold mb-2">Random Match</h1>
          <p className="text-slate-600 text-base">{status}</p>
        </div>

        {/* Main waiting / timeout card */}
        {!timedOut ? (
          <>
            <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-8">
              {/* Timer */}
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-blue-700 mb-2 tabular-nums">
                  {formatTime(waitingTime)}
                </div>
                <div className="text-slate-500 text-sm">Search time</div>
              </div>
              {/* Player info */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 text-slate-600">
                  <Users size={20} /> Players
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Current user */}
                  <div className="bg-blue-50 border border-blue-700 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold">YOU</span>
                    </div>
                    <div className="font-semibold text-slate-900">{username || 'Player'}</div>
                  </div>
                  {/* Waiting for opponent */}
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-md p-4 flex flex-col items-center justify-center">
                    <div className="animate-pulse text-slate-500 text-center">
                      <div className="w-8 h-8 bg-slate-200 rounded-full mx-auto mb-2"></div>
                      <div className="text-sm">Searching...</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Search status */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-slate-600 mb-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span>Looking for players with similar skill level</span>
                </div>
                <p className="text-sm text-slate-500">
                  We&apos;re matching you with players who have similar XP and common topics
                </p>
              </div>
            </div>
            {/* Tips */}
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-md p-4">
              <div className="section-label mb-2">While you wait</div>
              <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                <li>Make sure you have a stable internet connection</li>
                <li>Review your selected topics mentally</li>
                <li>Stay focused - the match will start immediately when found</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">No player(s) found</h2>
            <p className="text-slate-600 mb-6">You can try Solo Practice mode instead.</p>
            <button
              onClick={() => router.push('/practice-mode-setup')}
              className="px-10 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md transition-colors"
            >
              Solo Practice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
