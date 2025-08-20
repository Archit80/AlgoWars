import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import  LeaderboardService, { LeaderboardUser }  from "@/services/leaderboardService";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

// const leaderboardData = [
//   { rank: 1, name: "CodeNinja_2024", xp: "15,420 XP", badge: "🥇" },
//   { rank: 2, name: "AlgoMaster", xp: "14,890 XP", badge: "🥈" },
//   { rank: 3, name: "ByteWarrior", xp: "13,750 XP", badge: "🥉" },
//   { rank: 4, name: "StackOverflow_Hero", xp: "12,340 XP", badge: "⭐" },
//   { rank: 5, name: "DebuggingQueen", xp: "11,920 XP", badge: "⭐" },
// ];

const LeaderboardSection = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await LeaderboardService.getLeaderboard();
      console.log(response);
      return response;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section
      id="leaderboard"
      className="px-4 py-16 bg-gradient-to-b from-gray-900/50 to-transparent"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl lg:text-5xl font-bold mb-4 ${spaceGrotesk.className}`}
          >
            <span className="bg-gradient-to-b from-lime-400 to-green-500 bg-clip-text text-transparent">
              Hall of Fame
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            See where you stack up against the world&apos;s best coders
          </p>
        </div>
        <Card className="bg-gray-900/80 border-gray-800">
          <CardHeader>
            <CardTitle
              className={`flex items-center text-lime-400 ${spaceGrotesk.className}`}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Global Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.map((player: LeaderboardUser, index: number) => {
                let badge = "⭐";
                if (index === 0) badge = "🥇";
                else if (index === 1) badge = "🥈";
                else if (index === 2) badge = "🥉";
                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{badge}</span>
                      <div>
                        <p className="font-semibold text-white">{player.username}</p>
                        <p className="text-sm text-gray-400">
                          Rank #{index + 1} • {player.totalMatches} battles • {player.winRate}% win rate
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lime-400">{player.xp} XP</p>
                      <p className="text-sm text-gray-400">{player.accuracy}% accuracy</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default LeaderboardSection;
