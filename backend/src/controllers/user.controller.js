import prisma from "../db/prismaClient.js";
import AchievementService from "../services/achievementService.js";
import { getLevelFromXP, getLevelTier, isMilestoneLevel, getTimeToNextLevel } from "../utils/levelSystem.js";

export const getUserById = async (req, res) => {
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
      take: 5,
    });

    // Fetch all solo sessions for calculations
    const allSoloSessions = await prisma.soloSession.findMany({
      where: { userId },
    });

    // Use fast database counters instead of expensive queries
    const battlesWon = user.matchesWon;
    const totalBattles = user.totalMatches;

    // Calculate stats - use fast database counters when available
    const totalCorrectAnswers = allSoloSessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    const totalQuestions = allSoloSessions.reduce((sum, session) => sum + session.totalQuestions, 0);
    
    // Use database accuracy counters if available, fallback to solo session calculation
    const accuracy = user.totalAnswers > 0 ? 
      Math.round((user.correctAnswers / user.totalAnswers) * 100) :
      totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;
    
    // New exponential level calculation with milestone bonuses
    const levelInfo = getLevelFromXP(user.xp);
    const tierInfo = getLevelTier(levelInfo.level);
    const isAtMilestone = isMilestoneLevel(levelInfo.level);

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

    // Fetch recent battles (latest 5 matches where user is user1 or user2)
    const recentBattles = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ],
        status: 'COMPLETED'
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } },
        questions: true
      }
    });

    // Then merge them manually
    const userWithLatestSessions = {
      ...user,
      soloSessions,
      userAchievements: mergedUserAchievements,
      // New exponential level system data
      level: levelInfo.level,
      currentXP: user.xp,
      currentLevelXP: levelInfo.currentLevelXP,
      xpToNext: levelInfo.xpToNext,
      totalXPForNextLevel: levelInfo.totalXPForNextLevel,
      xpRequiredForCurrentLevel: levelInfo.xpRequiredForCurrentLevel,
      progress: levelInfo.progress, // Percentage progress (0-100)
      // Tier information
      tier: tierInfo.tier,
      tierName: tierInfo.tierName,
      tierColor: tierInfo.color,
      tierEmoji: tierInfo.emoji,
      isAtMilestone: isAtMilestone,
      // Legacy compatibility
      totalXP: levelInfo.totalXPForNextLevel, // For backward compatibility
      accuracy,
      battlesWon,
      totalBattles,
      // Fast database counters
      matchesWon: user.matchesWon,
      matchesLost: user.matchesLost,
      totalMatches: user.totalMatches,
      correctAnswers: user.correctAnswers,
      totalAnswers: user.totalAnswers,
      // Additional stats
      stats: {
        totalSoloSessions: allSoloSessions.length,
        totalCorrectAnswers,
        totalQuestions,
        winRate: totalBattles > 0 ? Math.round((battlesWon / totalBattles) * 100) : 0
      },
      // Attach recent battles for frontend profile
      recentBattles,
      // Onboarding status
      isOnboarded: user.isOnboarded
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

export const updateUserOnboarding = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, profilePic } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Update user info and set isOnboarded true
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        profilePic,
        isOnboarded: true
      }
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating onboarding info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user stats for fast access (uses explicit counters)
export const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userStats = await prisma.user.findUnique({
      where: { id: userId },
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
        lastMatchAt: true
      }
    });

    if (!userStats) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate derived stats
    const winRate = userStats.totalMatches > 0 ? 
      Math.round((userStats.matchesWon / userStats.totalMatches) * 100) : 0;
    const accuracy = userStats.totalAnswers > 0 ? 
      Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100) : 0;
    const matchesDrawn = userStats.totalMatches - userStats.matchesWon - userStats.matchesLost;

    res.json({
      success: true,
      stats: {
        ...userStats,
        longestStreak: userStats.longestStreak,
        winRate,
        accuracy,
        matchesDrawn
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserAchievements = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required"
      });
    }

    const achievements = await AchievementService.getUserAchievements(id);

    res.status(200).json({
      success: true,
      data: achievements
    });

  } catch (error) {
    console.error("Get user achievements error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Something went wrong." 
    });
  }
};

// Get detailed level information for a user
export const getUserLevelInfo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: "User ID is required" 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        xp: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    // Calculate level information
    const levelInfo = getLevelFromXP(user.xp);
    const tierInfo = getLevelTier(levelInfo.level);
    const timeEstimate = getTimeToNextLevel(levelInfo.xpToNext);
    const isAtMilestone = isMilestoneLevel(levelInfo.level);

    res.json({
      success: true,
      data: {
        userId: user.id,
        username: user.username,
        totalXP: user.xp,
        
        // Current level info
        level: levelInfo.level,
        currentLevelXP: levelInfo.currentLevelXP,
        xpRequiredForCurrentLevel: levelInfo.xpRequiredForCurrentLevel,
        progress: levelInfo.progress, // 0-100 percentage
        
        // Next level info
        xpToNext: levelInfo.xpToNext,
        totalXPForNextLevel: levelInfo.totalXPForNextLevel,
        
        // Tier information
        tier: {
          level: tierInfo.tier,
          name: tierInfo.tierName,
          color: tierInfo.color,
          emoji: tierInfo.emoji
        },
        
        // Special status
        isAtMilestone,
        
        // Time estimates
        timeToNextLevel: timeEstimate
      }
    });

  } catch (error) {
    console.error("Get user level info error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    // Validate that username is provided
    if (!username) {
      return res.status(400).json({
        message: "Username is required",
        error: "Missing username parameter in route",
      });
    }

    const user = await prisma.user.findUnique({
      where: { username: username },
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
      where: { userId: user.id },
      orderBy: { startedAt: "desc" },
      take: 5,
    });

    // Fetch all solo sessions for calculations
    const allSoloSessions = await prisma.soloSession.findMany({
      where: { userId: user.id },
    });

    // Use fast database counters instead of expensive queries
    const battlesWon = user.matchesWon;
    const totalBattles = user.totalMatches;

    // Calculate stats - use fast database counters when available
    const totalCorrectAnswers = allSoloSessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    const totalQuestions = allSoloSessions.reduce((sum, session) => sum + session.totalQuestions, 0);
    
    // Use database accuracy counters if available, fallback to solo session calculation
    const accuracy = user.totalAnswers > 0 ? 
      Math.round((user.correctAnswers / user.totalAnswers) * 100) :
      totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;
    
    // New exponential level calculation with milestone bonuses
    const levelInfo = getLevelFromXP(user.xp);
    const tierInfo = getLevelTier(levelInfo.level);
    const isAtMilestone = isMilestoneLevel(levelInfo.level);

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

    // Fetch recent battles (latest 5 matches where user is user1 or user2)
    const recentBattles = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: user.id },
          { user2Id: user.id }
        ],
        status: 'COMPLETED'
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } },
        questions: true
      }
    });

    // Then merge them manually
    const userWithLatestSessions = {
      ...user,
      soloSessions,
      userAchievements: mergedUserAchievements,
      // New exponential level system data
      level: levelInfo.level,
      currentXP: user.xp,
      currentLevelXP: levelInfo.currentLevelXP,
      xpToNext: levelInfo.xpToNext,
      totalXPForNextLevel: levelInfo.totalXPForNextLevel,
      xpRequiredForCurrentLevel: levelInfo.xpRequiredForCurrentLevel,
      progress: levelInfo.progress, // Percentage progress (0-100)
      // Tier information
      tier: tierInfo.tier,
      tierName: tierInfo.tierName,
      tierColor: tierInfo.color,
      tierEmoji: tierInfo.emoji,
      isAtMilestone: isAtMilestone,
      // Legacy compatibility
      totalXP: levelInfo.totalXPForNextLevel, // For backward compatibility
      accuracy,
      battlesWon,
      totalBattles,
      // Fast database counters
      matchesWon: user.matchesWon,
      matchesLost: user.matchesLost,
      totalMatches: user.totalMatches,
      correctAnswers: user.correctAnswers,
      totalAnswers: user.totalAnswers,
      // Additional stats
      stats: {
        totalSoloSessions: allSoloSessions.length,
        totalCorrectAnswers,
        totalQuestions,
        winRate: totalBattles > 0 ? Math.round((battlesWon / totalBattles) * 100) : 0
      },
      // Attach recent battles for frontend profile
      recentBattles,
      // Onboarding status
      isOnboarded: user.isOnboarded
    };
    // Return user data
    res.status(200).json({
      success: true,
      data: userWithLatestSessions,
    });

    // return userWithLatestSessions;
  } catch (error) {
    console.error("Error fetching user data by username:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get user stats by username for fast access
export const getUserStatsByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const userStats = await prisma.user.findUnique({
      where: { username: username },
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
        lastMatchAt: true
      }
    });

    if (!userStats) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate derived stats
    const winRate = userStats.totalMatches > 0 ? 
      Math.round((userStats.matchesWon / userStats.totalMatches) * 100) : 0;
    const accuracy = userStats.totalAnswers > 0 ? 
      Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100) : 0;
    const matchesDrawn = userStats.totalMatches - userStats.matchesWon - userStats.matchesLost;

    res.json({
      success: true,
      stats: {
        ...userStats,
        longestStreak: userStats.longestStreak,
        winRate,
        accuracy,
        matchesDrawn
      }
    });
  } catch (error) {
    console.error("Error fetching user stats by username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
