"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Trophy, Medal } from "lucide-react"
import { useQuery } from "@tanstack/react-query";
import LeaderboardService, { LeaderboardUser } from "@/services/leaderboardService";
import { QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { createOptimizedQueryClient, queryOptions } from "@/lib/optimizedQueryClient";

export function Leaderboard() {
  const [queryClient] = useState(() => createOptimizedQueryClient()); // Use optimized client
  // rank icon helper in outer scope so it can be used by the inner renderer
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-amber-600" />
      case 2:
        return <Trophy className="w-5 h-5 text-slate-500" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />
      default:
        return <span className="flex items-center justify-center text-sm font-semibold text-slate-500">#{rank}</span>
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
      ...queryOptions.realtime, // Use optimized realtime options
    });

    // Keep rendering the same UI; if loading, show placeholders
    const leaderboard = data ?? [] as LeaderboardUser[];


    return (
      <Card className="md:max-w-5xl mx-auto bg-white border border-slate-200 shadow-sm">
        <CardHeader>
          <p className="section-label">Table 1</p>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-900 rule-title">
            <Trophy className="w-5 h-5 text-blue-700" />
            Global Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-slate-500">Loading leaderboard...</div>
          )}
          {error && (
            <div className="text-red-600">Failed to load leaderboard</div>
          )}
          {!isLoading && !error && (
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 font-semibold w-16">Rank</th>
                    <th className="px-4 py-2 font-semibold">Student</th>
                    <th className="px-4 py-2 font-semibold">Level</th>
                    <th className="px-4 py-2 font-semibold text-right">XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {leaderboard.map((player, idx) => (
                    <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">{getRankIcon(idx + 1)}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/profile/${player.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-slate-900 hover:text-blue-700"
                        >
                          {player.profilePic ? (
                            <Image
                              width={32}
                              height={32}
                              src={player.profilePic}
                              alt={player.username + " avatar"}
                              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 text-sm font-semibold">
                              {player.username?.[0] ?? "?"}
                            </div>
                          )}
                          <span className="font-medium">{player.username}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{player.level ?? 0}</td>
                      <td className="px-4 py-3 text-right">
                        <Badge className={idx === 0 ? "bg-blue-700 text-white font-semibold" : "bg-blue-50 text-blue-900 border border-blue-100"}>
                          {(player.xp ?? 0).toLocaleString()} XP
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
