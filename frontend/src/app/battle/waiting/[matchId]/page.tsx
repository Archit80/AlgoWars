"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Users, Check } from "lucide-react";
import MatchService from "@/services/matchService";
import { useUserStore } from "@/stores/userStore";

type MatchSummary = {
  id: string;
  difficulty: string;
  categories: string[];
  isPrivate: boolean;
  roomCode?: string | null;
  status: "WAITING" | "ONGOING" | "COMPLETED" | string;
};

export default function WaitingRoom() {
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const matchId = (params?.matchId as string) || "";
  const router = useRouter();
  const [match, setMatch] = useState<MatchSummary | null>(null);
  // Use real user info from Zustand store
  const user = {
    name: "You",
  };

  useEffect(() => {
    // Handle random match waiting
    if (matchId === "random") {
      router.push("/battle/waiting/random");
      return;
    }

    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      try {
        const data = await MatchService.getStatus(matchId);
        if (!active) return;
        setMatch(data.match);
        if (data?.isReady && data?.match?.id) {
          router.push(`/battle/play/${data.match.id}`);
          return;
        }
      } catch {}
      timer = setTimeout(poll, 1500);
    };
    if (matchId) poll();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [matchId, router]);

  const shareLink =
    typeof window !== "undefined" && match?.roomCode
      ? `${window.location.origin}/battle/join?code=${match.roomCode}`
      : "";
  const difficulty = match?.difficulty || "Medium";

  return (
    <div className="min-h-screen flex items-start justify-center bg-white text-slate-900">
      <style>{`
        @keyframes blink-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-blink-slow {
          animation: blink-slow 2s infinite;
        }
      `}</style>
      <div className="max-w-2xl w-full mt-12">
        <div className="section-label text-center mb-1">Private Match</div>
        <h1 className="text-3xl font-bold text-center mb-2">
          Challenge Lobby
        </h1>
        <div className="text-center text-slate-600 mb-8 text-base">
          {match?.status === "WAITING"
            ? "Waiting for your friend to join..."
            : ""}
        </div>
        <div className="rounded-lg shadow-sm bg-white border border-slate-200 p-8 mx-auto relative">
          {/* Room code and copy link */}
          <div className="flex items-center justify-between mb-6">
            <div
              className="text-xl font-bold text-slate-900"
            >
              Room:{" "}
              <span className="text-blue-700 font-mono">{match?.roomCode || "-"}</span>
            </div>
            {match?.isPrivate && (
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
                className="bg-white border border-slate-300 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 hover:cursor-pointer flex items-center gap-2"
              >
                {copied ? (
                  <Check size={18} className="text-blue-700" />
                ) : (
                  <Copy size={18} className="text-blue-700" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            )}
          </div>
          {/* Topics and Difficulty summary */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-slate-500 mb-2 text-sm">Topics:</div>
              <div className="flex gap-2">
                {(match?.categories || []).map((cat, i) => (
                  <span
                    key={cat + i}
                    className="px-3 py-1 rounded-full bg-slate-50 text-slate-900 text-sm font-medium border border-slate-200"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-slate-500 mb-2 text-sm">Difficulty:</div>
              <span className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-sm font-semibold">
                {difficulty}
              </span>
            </div>
          </div>
          {/* Players */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 text-slate-600">
              <Users size={20} className="text-slate-500" /> Players (
              {match?.status === "WAITING" ? "1" : "2"}/2)
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Player 1 */}
              <div className="rounded-md bg-blue-50 border border-blue-700 p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                    YOU
                  </span>
                  <span className="font-semibold text-slate-900">{user.name}</span>
                </div>
               
              </div>
              {/* Player 2 */}
              <div className="rounded-md bg-slate-50 border border-dashed border-slate-300 p-4 flex flex-col items-center justify-center">
                {match?.status === "WAITING" ? (
                  <div
                    className="text-slate-500 animate-blink-slow text-center"
                  >
                    Waiting for peer...
                  </div>
                ) : (
                  <div className="font-semibold text-slate-900">Peer</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
