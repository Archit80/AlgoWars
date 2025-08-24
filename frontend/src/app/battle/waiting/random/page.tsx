/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import { Space_Grotesk } from "next/font/google";
import { Users, ArrowLeft } from "lucide-react";
import { getSocket, joinUserRoom } from "@/lib/socket";
import { useUserStore } from "@/stores/userStore";
import { useMatchStore } from "@/stores/matchStore";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export default function RandomWaitingRoom() {
  const { supabaseUser } = useUser();
  const router = useRouter();
  const { userStats } = useUserStore();
  const { setMatchData } = useMatchStore();
  const username = (supabaseUser as any)?.user_metadata?.username;
  const [waitingTime, setWaitingTime] = useState(0);
  const [status, setStatus] = useState("Searching for opponent...");
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

  // Separate useEffect for socket setup - only depends on stable user ID
  useEffect(() => {
    if (!supabaseUser || !(supabaseUser as any)?.id) {
      console.log('[Random Waiting] No user ID available, skipping socket setup');
      return;
    }

    console.log(`[Random Waiting] Setting up socket for user: ${(supabaseUser as any).id}`);

    // Get socket and ensure it's connected
    const socket = getSocket();
    
    const setupSocket = () => {
      // Join user-specific room for notifications
      console.log(`[Random Waiting] Joining user room: ${(supabaseUser as any).id}`);
      joinUserRoom((supabaseUser as any).id);
      
      const handleMatchFound = (data: { matchId: string; opponent: { userId: string; username: string; xp: number } }) => {
        console.log('[Random Waiting] Match found:', data);
        setStatus("Match found! Redirecting...");
        
        // Store match data in Zustand with usernames
        setMatchData({
          matchId: data.matchId,
          user1Id: (supabaseUser as any).id,
          user2Id: data.opponent.userId,
                user1Username: username || 'You',
          user2Username: data.opponent.username,
          user1Score: 0,
          user2Score: 0,
          currentIndex: 0,
          status: 'ONGOING'
        });
        
        setTimeout(() => {
          router.push(`/battle/play/${data.matchId}`);
        }, 1000);
      };

      socket.on('match:found', handleMatchFound);
      console.log(`[Random Waiting] Socket listener added for match:found`);

      return handleMatchFound;
    };

    // If socket is already connected, setup immediately
    let handleMatchFound;
    if (socket.connected) {
      console.log(`[Random Waiting] Socket already connected`);
      handleMatchFound = setupSocket();
    } else {
      // Wait for connection before setting up
      console.log(`[Random Waiting] Waiting for socket connection...`);
      const onConnect = () => {
        console.log(`[Random Waiting] Socket connected, setting up...`);
        handleMatchFound = setupSocket();
      };
      socket.on('connect', onConnect);
      
      // Cleanup connect listener
      const cleanupConnect = () => socket.off('connect', onConnect);
      return cleanupConnect;
    }

    // Cleanup
    return () => {
      if (handleMatchFound) {
        socket.off('match:found', handleMatchFound);
      }
      console.log(`[Random Waiting] Socket cleanup completed for user: ${(supabaseUser as any).id}`);
    };
  }, [router, supabaseUser?.id, setMatchData, username]);

  // Timeout logic: after 90s without match, show fallback UI
  useEffect(() => {
    if (!timedOut && waitingTime >= 90 && status !== 'Match found! Redirecting...') {
      setTimedOut(true);
      setStatus('No player(s) found.');
      // Optionally disconnect or stop listening to conserve resources
      try {
        const socket = getSocket();
        if (socket?.connected) {
          socket.off('match:found');
        }
      } catch (e) {
        // swallow
      }
    }
  }, [waitingTime, timedOut, status]);

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
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E0E] text-white">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(132, 204, 22, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 20px rgba(132, 204, 22, 0.6);
            transform: scale(1.02);
          }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 6s infinite;
        }
      `}</style>
      
      <div className="max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              type="button"
              className="absolute top-6 left-6 p-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-all"
              onClick={() => {
                const socket = getSocket();
                if (socket && socket.connected) {
                  socket.disconnect();
                }
                router.push('/battle');
              }}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
          </div>
          <h1 className={`${spaceGrotesk.className} text-4xl font-bold mb-2`}>Random Match</h1>
          <p className="text-neutral-400 text-lg">{status}</p>
        </div>

        {/* Main waiting / timeout card */}
        {!timedOut ? (
          <>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 animate-pulse-glow">
              {/* Timer */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-lime-400 mb-2">
                  {formatTime(waitingTime)}
                </div>
                <div className="text-neutral-400">Search time</div>
              </div>
              {/* Player info */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 text-neutral-400">
                  <Users size={20} /> Players
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Current user */}
                  <div className="bg-lime-500/10 border border-lime-400 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-lime-500 text-black px-3 py-1 rounded-full text-xs font-bold">YOU</span>
                    </div>
                    <div className="font-semibold text-white">{username || 'Player'}</div>
                    <div className="text-xs text-lime-400">Level {userStats?.level || 1}</div>
                  </div>
                  {/* Waiting for opponent */}
                  <div className="bg-neutral-800/50 border-2 border-dashed border-neutral-600 rounded-xl p-4 flex flex-col items-center justify-center">
                    <div className="animate-pulse text-neutral-400 text-center">
                      <div className="w-8 h-8 bg-neutral-600 rounded-full mx-auto mb-2"></div>
                      <div className="text-sm">Searching...</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Search status */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-neutral-400 mb-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span>Looking for players with similar skill level</span>
                </div>
                <p className="text-sm text-neutral-500">
                  We&apos;re matching you with players who have similar XP and common topics
                </p>
              </div>
            </div>
            {/* Tips */}
            <div className="mt-6 bg-neutral-900/30 border border-neutral-800 rounded-xl p-4">
              <div className="text-lime-400 font-semibold mb-2">💡 While you wait:</div>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li>• Make sure you have a stable internet connection</li>
                <li>• Review your selected topics mentally</li>
                <li>• Stay focused - the match will start immediately when found!</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-red-400 mb-4">No player(s) found</h2>
            <p className="text-neutral-300 mb-6 text-lg">You can try Solo Practice mode instead.</p>
            <button
              onClick={() => router.push('/practice-mode-setup')}
              className="px-10 py-4 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl transition-all text-lg"
            >
              Solo Practice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
