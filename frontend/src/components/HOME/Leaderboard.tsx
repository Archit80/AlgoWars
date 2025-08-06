import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Trophy, Medal } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  username: string
  xp: number
  level: number
  wins: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "CodeNinja42", xp: 25680, level: 47, wins: 156 },
  { rank: 2, username: "AlgoMaster", xp: 23450, level: 44, wins: 142 },
  { rank: 3, username: "ByteWarrior", xp: 22890, level: 43, wins: 138 },
  { rank: 4, username: "LogicLord", xp: 21340, level: 41, wins: 127 },
  { rank: 5, username: "SyntaxSlayer", xp: 20100, level: 39, wins: 119 },
]

export function Leaderboard() {
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

  return (
    <Card className="md:max-w-5xl mx-auto bg-neutral-900 border-2 border-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg ml-1 -mb-2 text-white">
          <Trophy className="w-6 h-6 text-lime-400" />
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockLeaderboard.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center justify-between py-3 px-6 rounded-lg bg-neutral-800/60 transition-colors"
          >
            <div className="flex items-center gap-4 ">
              {getRankIcon(entry.rank)}
              <div>
                <p className="font-semibold text-white">{entry.username}</p>
                <p className="text-sm text-muted-foreground">
                  Level {entry.level} • {entry.wins} wins
                </p>
              </div>
            </div>
            <Badge className={entry.rank === 1 ? "bg-lime-400 font-semibold shadow-lime-300 shadow-sm text-black" : "bg-neutral-700 text-white"}>
              {entry.xp.toLocaleString()} XP
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}