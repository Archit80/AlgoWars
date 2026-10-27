
"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { useMatchStore } from "@/stores/matchStore";
import MatchService from "@/services/matchService";

function JoinByCodeInner() {
  const params = useSearchParams();
  const router = useRouter();
  const user = useUserStore((s) => s.supabaseUser);
  const loading = useUserStore((s) => s.loading);
  const { setMatchData } = useMatchStore();
  const [code, setCode] = useState(params.get("code") || "");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const prefill = params.get("code");
    if (prefill) setCode(prefill);
  }, [params]);

  // Redirect to /login if user is not authenticated and loading is false
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleJoin = async () => {
    if (!code) return;
    setJoining(true);
    try {
      const res = await MatchService.joinByCode({ roomCode: code });
      const match = res.match;
      // Store match data with usernames if available
      if (match) {
        setMatchData({
          matchId: match.id,
          user1Id: match.user1Id,
          user2Id: match.user2Id,
          user1Username: match.user1Username || match.user1?.username,
          user2Username: match.user2Username || match.user2?.username,
          user1Score: match.user1Score || 0,
          user2Score: match.user2Score || 0,
          currentIndex: match.currentIndex || 0,
          status: match.status || 'WAITING'
        });
      }
      if (match?.status === "ONGOING") router.push(`/battle/play/${match.id}`);
      else router.push(`/battle/waiting/${match.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to join room. Check code and try again.");
    } finally {
      setJoining(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>;
  }
  if (!user) {
    return <></>;
  }
  return (
    <div className="min-h-screen p-6 bg-white text-slate-900">
      <div className="max-w-md mx-auto">
        <div className="section-label mb-1">Private Match</div>
        <h1 className="rule-title text-3xl font-bold text-slate-900 mb-6">Join a Private Room</h1>
        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-6 space-y-3">
          <label className="block text-sm font-medium text-slate-600">Room code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-8 char code"
            className="w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          />
          <Button onClick={handleJoin} disabled={!code || joining} className="bg-blue-700 hover:bg-blue-800 text-center text-white hover:cursor-pointer">
            {joining ? "Joining..." : "Join"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function JoinByCode() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>}>
      <JoinByCodeInner />
    </Suspense>
  );
}
