"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Trophy, Medal } from "lucide-react"
import { useQuery } from "@tanstack/react-query";
import LeaderboardService, { LeaderboardUser } from "@/services/leaderboardService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export function Leaderboard() {
  const [queryClient] = useState(() => new QueryClient());
  // rank icon helper in outer scope so it can be used by the inner renderer
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-300" />
      case 2:
        return <Trophy className="w-5 h-5 text-neutral-200" />
      case 3:
        return <Medal className="w-5 h-5 text-orange-400" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-lg font-bold text-neutral-400">#{rank}</span>
    }
  }

  // Move useQuery into a child so it runs inside the QueryClientProvider
  function LeaderboardContent() {
    const { data, isLoading, error } = useQuery({
      queryKey: ["leaderboard"],
      queryFn: async () => {
        const res = await LeaderboardService.getLeaderboard();
        return res;
      },
    });

    // Keep rendering the same UI; if loading, show placeholders
    const leaderboard = data ?? [] as LeaderboardUser[];

    return (
      <Card className="md:max-w-5xl mx-auto bg-neutral-900 border-2 border-neutral-800 z-20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg ml-1 -mb-2 text-white">
            <Trophy className="w-6 h-6 text-lime-400" />
            Global Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && (
            <div className="text-gray-400">Loading leaderboard...</div>
          )}
          {error && (
            <div className="text-red-400">Failed to load leaderboard</div>
          )}
          {!isLoading && !error && leaderboard.map((player, idx) => (
            <Link
              key={player.id}
              href={`/profile/${player.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div
                className="flex items-center justify-between py-3 px-6 rounded-lg bg-neutral-800/60 transition-colors hover:bg-neutral-800 cursor-pointer"
              >
              <div className="flex items-center gap-4 ">
                {getRankIcon(idx + 1)}
                {player.profilePic ? (
                  <Image
                    width={40}
                    height={40}
                    src={player.profilePic}
                    alt={player.username + " avatar"}
                    className="w-10 h-10 rounded-full border border-neutral-700 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white text-lg font-bold">
                    {player.username?.[0] ?? "?"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{player.username}</p>
                  <p className="text-sm text-muted-foreground">
                    Level {player.level ?? 0}
                  </p>
                </div>
              </div>
              <Badge className={idx === 0 ? "bg-lime-400 font-semibold shadow-lime-300 shadow-sm text-black" : "bg-neutral-700 text-white"}>
                {(player.xp ?? 0).toLocaleString()} XP
              </Badge>
            </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LeaderboardContent />
    </QueryClientProvider>
  )
}