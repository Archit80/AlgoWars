"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Copy, Users, Check } from "lucide-react";
import MatchService from "@/services/matchService";
import { useUserStore } from "@/stores/userStore";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

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
  const userStats = useUserStore((state) => state.userStats);
  const user = {
    name: "You",
    level: userStats?.level ?? 1,
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
    <div className="min-h-screen flex items-start justify-center bg-[#0E0E0E] text-white">
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
        <h1
          className={`${spaceGrotesk.className} text-4xl font-bold text-center mb-2`}
        >
          Battle Lobby
        </h1>
        <div className="text-center text-neutral-400 mb-8 text-lg">
          {match?.status === "WAITING"
            ? "Waiting for your friend to join..."
            : ""}
        </div>
        <div className="rounded-2xl shadow-sm bg-neutral-900 border border-neutral-800 p-8 mx-auto relative shadow-black hover:shadow-none ">
          {/* Room code and copy link */}
          <div className="flex items-center justify-between mb-6">
            <div
              className={`text-xl font-bold ${spaceGrotesk.className} text-white`}
            >
              Room:{" "}
              <span className="text-lime-400">{match?.roomCode || "-"}</span>
            </div>
            {match?.isPrivate && (
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
                className={`bg-neutral-900 border border-neutral-700 text-lime-400 px-4 py-2 rounded-lg hover:bg-lime-500/10 hover:cursor-pointer flex items-center gap-2 ${spaceGrotesk.className}`}
              >
                {copied ? (
                  <Check size={18} className="text-lime-400" />
                ) : (
                  <Copy size={18} className="text-lime-400" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            )}
          </div>
          {/* Topics and Difficulty summary */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-neutral-400 mb-2 text-lg">Topics:</div>
              <div className="flex gap-2">
                {(match?.categories || []).map((cat, i) => (
                  <span
                    key={cat + i}
                    className="px-3 py-1 rounded-full bg-neutral-900 text-white text-sm font-semibold border border-neutral-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-neutral-400 mb-2 text-lg">Difficulty:</div>
              <span className="px-4 py-1 rounded-full bg-lime-400 text-zinc-900 text-base font-semibold shadow-lg">
                {difficulty}
              </span>
            </div>
          </div>
          {/* Players */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 text-neutral-400">
              <Users size={20} className="text-neutral-400" /> Players (
              {match?.status === "WAITING" ? "1" : "2"}/2)
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Player 1 */}
              <div className="rounded-xl bg-lime-600/10 border border-lime-400 p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-lime-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                    YOU
                  </span>
                  <span className="font-semibold text-white">{user.name}</span>
                </div>
                <span className="text-xs bg-neutral-900 text-lime-400 px-2 py-1 rounded">
                  Level {user.level}
                </span>
              </div>
              {/* Player 2 */}
              <div className="rounded-xl bg-neutral-900 border-2 border-dashed border-neutral-700 p-4 flex flex-col items-center justify-center">
                {match?.status === "WAITING" ? (
                  <div
                    className={`text-neutral-400 animate-blink-slow ${spaceGrotesk.className} text-center`}
                  >
                    Waiting for opponent...
                  </div>
                ) : (
                  <div className="font-semibold text-white">Opponent</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
