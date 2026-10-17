import prisma from "../db/prismaClient.js";
import AchievementService from "../services/achievementService.js";
import { getLevelFromXP, getLevelTier, isMilestoneLevel, getTimeToNextLevel } from "../utils/levelSystem.js";

const percent = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

// Full public profile, shared by the id- and username-based routes.
async function buildProfile(where) {
  const user = await prisma.user.findUnique({
    where,
    include: { userAchievements: { include: { achievement: true } } },
  });
  if (!user) return null;

  const [soloSessions, soloTotals, allAchievements, recentBattles] = await Promise.all([
    prisma.soloSession.findMany({ where: { userId: user.id }, orderBy: { startedAt: "desc" }, take: 5 }),
    prisma.soloSession.aggregate({
      where: { userId: user.id },
      _count: true,
      _sum: { correctAnswers: true, totalQuestions: true },
    }),
    prisma.achievement.findMany(),
    prisma.match.findMany({
      where: { OR: [{ user1Id: user.id }, { user2Id: user.id }], status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } },
      },
    }),
  ]);

  const totalCorrectAnswers = soloTotals._sum.correctAnswers ?? 0;
  const totalQuestions = soloTotals._sum.totalQuestions ?? 0;
  // Prefer the all-modes counters; fall back to solo totals for users with none yet
  const accuracy = user.totalAnswers > 0
    ? percent(user.correctAnswers, user.totalAnswers)
    : percent(totalCorrectAnswers, totalQuestions);

  const levelInfo = getLevelFromXP(user.xp);
  const tierInfo = getLevelTier(levelInfo.level);

  // Every achievement, with the user's progress where they have any
  const userAchievementMap = new Map(user.userAchievements.map((ua) => [ua.achievementId, ua]));
  const mergedUserAchievements = allAchievements.map((achievement) => {
    const ua = userAchievementMap.get(achievement.id);
    return {
      id: ua?.id ?? null,
      progress: ua?.progress ?? 0,
      unlocked: ua?.unlocked ?? false,
      updatedAt: ua?.updatedAt ?? null,
      achievement,
    };
  });

  // Email is private — never include it in profile responses
  const { email: _email, ...publicUser } = user;
  return {
    ...publicUser,
    soloSessions,
    userAchievements: mergedUserAchievements,
    level: levelInfo.level,
    currentXP: user.xp,
    currentLevelXP: levelInfo.currentLevelXP,
    xpToNext: levelInfo.xpToNext,
    totalXPForNextLevel: levelInfo.totalXPForNextLevel,
    xpRequiredForCurrentLevel: levelInfo.xpRequiredForCurrentLevel,
    progress: levelInfo.progress, // 0-100
    tier: tierInfo.tier,
    tierName: tierInfo.tierName,
    tierColor: tierInfo.color,
    tierEmoji: tierInfo.emoji,
    isAtMilestone: isMilestoneLevel(levelInfo.level),
    totalXP: levelInfo.totalXPForNextLevel, // legacy alias
    accuracy,
    battlesWon: user.matchesWon,
    totalBattles: user.totalMatches,
    stats: {
      totalSoloSessions: soloTotals._count,
      totalCorrectAnswers,
      totalQuestions,
      winRate: percent(user.matchesWon, user.totalMatches),
    },
    recentBattles,
  };
}

// Lightweight counters, shared by the id- and username-based routes.
async function buildStats(where) {
  const user = await prisma.user.findUnique({
    where,
    select: {
      id: true,
      username: true,
      xp: true,
      streak: true,
      longestStreak: true,
      totalMatches: true,
      matchesWon: true,
      matchesLost: true,
      correctAnswers: true,
      totalAnswers: true,
      lastMatchAt: true,
    },
  });
  if (!user) return null;
  return {
    ...user,
    winRate: percent(user.matchesWon, user.totalMatches),
    accuracy: percent(user.correctAnswers, user.totalAnswers),
    matchesDrawn: user.totalMatches - user.matchesWon - user.matchesLost,
  };
}

const sendProfile = (where) => async (req, res) => {
  try {
    const profile = await buildProfile(where(req));
    if (!profile) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendStats = (where) => async (req, res) => {
  try {
    const stats = await buildStats(where(req));
    if (!stats) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = sendProfile((req) => ({ id: req.params.id }));
export const getUserByUsername = sendProfile((req) => ({ username: req.params.username }));
export const getUserStats = sendStats((req) => ({ id: req.params.id }));
export const getUserStatsByUsername = sendStats((req) => ({ username: req.params.username }));

export const updateUserOnboarding = async (req, res) => {
  try {
    const { username, profilePic } = req.body; // validated by middleware
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { username, profilePic: profilePic || null, isOnboarded: true },
    });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Username already taken" });
    }
    console.error("Error updating onboarding info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserAchievements = async (req, res) => {
  try {
    const achievements = await AchievementService.getUserAchievements(req.params.id);
    res.status(200).json({ success: true, data: achievements });
  } catch (error) {
    console.error("Get user achievements error:", error);
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
};

// Get detailed level information for a user
export const getUserLevelInfo = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, username: true, xp: true },
    });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const levelInfo = getLevelFromXP(user.xp);
    const tierInfo = getLevelTier(levelInfo.level);

    res.json({
      success: true,
      data: {
        userId: user.id,
        username: user.username,
        totalXP: user.xp,
        level: levelInfo.level,
        currentLevelXP: levelInfo.currentLevelXP,
        xpRequiredForCurrentLevel: levelInfo.xpRequiredForCurrentLevel,
        progress: levelInfo.progress, // 0-100
        xpToNext: levelInfo.xpToNext,
        totalXPForNextLevel: levelInfo.totalXPForNextLevel,
        tier: {
          level: tierInfo.tier,
          name: tierInfo.tierName,
          color: tierInfo.color,
          emoji: tierInfo.emoji,
        },
        isAtMilestone: isMilestoneLevel(levelInfo.level),
        timeToNextLevel: getTimeToNextLevel(levelInfo.xpToNext),
      },
    });
  } catch (error) {
    console.error("Get user level info error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
