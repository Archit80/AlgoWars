import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import  LeaderboardService, { LeaderboardUser }  from "@/services/leaderboardService";
import Image from "next/image";

const LeaderboardSection = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await LeaderboardService.getLeaderboard();
      console.log(response);
      return response;
    },
  });

  if (isLoading) return <div className="py-8 text-center text-slate-600">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-600">Error: {error.message}</div>;

  return (
    <section
      id="leaderboard"
      className="px-4 py-20 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="section-label mb-2">04 &middot; Results</p>
          <h2 className="rule-title text-3xl lg:text-4xl font-bold text-slate-900 mb-4 inline-block">
            Global Leaderboard
          </h2>
          <p className="text-lg text-slate-600">
            Ranking of players by accumulated experience points.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <caption className="caption-top px-4 py-3 text-left text-xs text-slate-500 border-b border-slate-200">
              <Trophy className="inline w-4 h-4 mr-1 text-blue-700 align-text-bottom" />
              Table 1. Top players ranked by XP.
            </caption>
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Rank</th>
                <th className="px-4 py-3 font-semibold">Player</th>
                <th className="px-4 py-3 font-semibold text-right">Challenges</th>
                <th className="px-4 py-3 font-semibold text-right">Win Rate</th>
                <th className="px-4 py-3 font-semibold text-right">Accuracy</th>
                <th className="px-4 py-3 font-semibold text-right">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.map((player: LeaderboardUser, index: number) => (
                <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {player.profilePic ? (
                        <Image
                          width={32}
                          height={32}
                          src={player.profilePic}
                          alt={player.username + " avatar"}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold">
                          {player.username?.[0] ?? "?"}
                        </div>
                      )}
                      <span className="font-medium text-slate-900">{player.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">{player.totalMatches}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{player.winRate}%</td>
                  <td className="px-4 py-3 text-right text-slate-600">{player.accuracy}%</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">{player.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
export default LeaderboardSection;
