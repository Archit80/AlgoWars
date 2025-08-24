import prisma  from  "../db/prismaClient.js";
import { getLevelFromXP, getLevelTier } from "../utils/levelSystem.js";

export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: [
        { xp: "desc" },
      ],
      take: 10,
      select: {
        id: true,
        username: true,
        xp: true,
        streak: true,
        totalMatches: true,
        matchesWon: true,
        matchesLost: true,
        correctAnswers: true,
        totalAnswers: true,
        profilePic: true,
      },
    });

    // Calculate derived stats for each user including new level system
    const leaderboardData = topUsers.map((user, index) => {
      const levelInfo = getLevelFromXP(user.xp);
      const tierInfo = getLevelTier(levelInfo.level);

      // build explicit response shape so frontend can rely on 'level'
      return {
        id: user.id,
        username: user.username,
        xp: user.xp,
        streak: user.streak,
        totalMatches: user.totalMatches,
        matchesWon: user.matchesWon,
        matchesLost: user.matchesLost,
        correctAnswers: user.correctAnswers,
        totalAnswers: user.totalAnswers,
        profilePic: user.profilePic,
        rank: index + 1,
        level: levelInfo.level,
        tier: tierInfo.tier,
        tierName: tierInfo.tierName,
        tierColor: tierInfo.color,
        tierEmoji: tierInfo.emoji,
        winRate: user.totalMatches > 0 
          ? Math.round((user.matchesWon / user.totalMatches) * 100)
          : 0,
        accuracy: user.totalAnswers > 0 
          ? Math.round((user.correctAnswers / user.totalAnswers) * 100) 
          : 0,
      };
    });

    res.json({ success: true, data: leaderboardData });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ success: false, error: "Something broke." });
  }
};
