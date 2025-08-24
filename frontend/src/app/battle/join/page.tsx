"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { useMatchStore } from "@/stores/matchStore";
import MatchService from "@/services/matchService";

export default function JoinByCode() {
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
      const userId = user?.id || "guest";
      const res = await MatchService.joinByCode({ userId, roomCode: code });
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
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }
  if (!user) {
    return <></>;
  }
  return (
    <div className="min-h-screen p-6 bg-[#0E0E0E] text-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-lime-500 mb-4">Join a Private Room</h1>
        <div className="space-y-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-8 char code"
            className="w-full px-4 py-3 rounded border border-neutral-700 bg-neutral-900/50"
          />
          <Button onClick={handleJoin} disabled={!code || joining} className="bg-lime-600 hover:bg-lime-500 text-black">
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}
