import prisma from "../db/prismaClient.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: "Missing userId parameter in route",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAchievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch 3 latest solo sessions separately
    const soloSessions = await prisma.soloSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 3,
    });

    // Fetch all solo sessions for calculations
    const allSoloSessions = await prisma.soloSession.findMany({
      where: { userId },
    });

    // Fetch battle stats (wins from matches)
    const battlesWon = await prisma.match.count({
      where: { winnerId: userId },
    });

    const totalBattles = await prisma.match.count({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });

    // Calculate stats
    const totalCorrectAnswers = allSoloSessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    const totalQuestions = allSoloSessions.reduce((sum, session) => sum + session.totalQuestions, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;
    
    // Level calculation (100 XP per level)
    const level = Math.floor(user.xp / 100) + 1;
    const currentLevelXP = user.xp % 100;
    const xpToNext = 100 - currentLevelXP;
    const totalXPForNextLevel = user.xp + xpToNext;

    // Fetch all achievements
    const allAchievements = await prisma.achievement.findMany();

    // Map user's achievements by achievementId for quick lookup
    const userAchievementMap = {};
    user.userAchievements.forEach(ua => {
      userAchievementMap[ua.achievementId] = ua;
    });

    // Build userAchievements array with all achievements
    const mergedUserAchievements = allAchievements.map(achievement => {
      const ua = userAchievementMap[achievement.id];
      if (ua) {
        // User has this achievement
        return {
          id: ua.id,
          progress: ua.progress,
          unlocked: ua.unlocked,
          updatedAt: ua.updatedAt,
          achievement,
        };
      } else {
        // User does not have this achievement yet
        return {
          id: null,
          progress: 0,
          unlocked: false,
          updatedAt: null,
          achievement,
        };
      }
    });

    // Then merge them manually
    const userWithLatestSessions = {
      ...user,
      soloSessions,
      userAchievements: mergedUserAchievements,
      // Calculated stats
      level,
      currentXP: user.xp,
      xpToNext,
      totalXP: totalXPForNextLevel,
      accuracy,
      battlesWon,
      totalBattles,
      // Additional stats
      stats: {
        totalSoloSessions: allSoloSessions.length,
        totalCorrectAnswers,
        totalQuestions,
        winRate: totalBattles > 0 ? Math.round((battlesWon / totalBattles) * 100) : 0
      }
    };

    // Return user data
    res.status(200).json({
      success: true,
      data: userWithLatestSessions,
    });

    // return userWithLatestSessions;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
