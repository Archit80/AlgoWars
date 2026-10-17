import prisma from "../db/prismaClient.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const utcDay = (date) => Math.floor(date.getTime() / DAY_MS);

// Streak fields to write for activity happening `now` (days are UTC).
// Call inside the activity's transaction, BEFORE that activity's lastMatchAt / endedAt is written,
// so "last active" still reflects the previous activity. Returns {} when nothing changes.
export async function streakUpdate(tx, userId, now, { excludeSoloSessionId } = {}) {
  const [user, lastSolo] = await Promise.all([
    tx.user.findUnique({ where: { id: userId }, select: { streak: true, longestStreak: true, lastMatchAt: true } }),
    tx.soloSession.findFirst({
      where: {
        userId,
        endedAt: { not: null },
        ...(excludeSoloSessionId && { id: { not: excludeSoloSessionId } }),
      },
      orderBy: { endedAt: 'desc' },
      select: { endedAt: true },
    }),
  ]);
  if (!user) return {};

  const lastActive = Math.max(user.lastMatchAt?.getTime() ?? 0, lastSolo?.endedAt?.getTime() ?? 0);
  const today = utcDay(now);
  let streak = 1;
  if (lastActive) {
    const lastDay = utcDay(new Date(lastActive));
    if (lastDay === today) {
      if (user.streak > 0) return {};
    } else if (lastDay === today - 1) {
      streak = user.streak + 1;
    }
  }
  return { streak, longestStreak: Math.max(streak, user.longestStreak) };
}

export class AchievementService {

  // Recompute achievement progress and persist only what changed. Unlocks are permanent.
  static async checkAchievements(userId) {
    try {
      const [user, achievements, existing, [solo]] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { longestStreak: true, matchesWon: true } }),
        prisma.achievement.findMany(),
        prisma.userAchievement.findMany({ where: { userId } }),
        prisma.$queryRaw`
          SELECT
            COUNT(*) FILTER (WHERE "totalQuestions" > 0 AND "correctAnswers" = "totalQuestions") AS perfect,
            COUNT(*) FILTER (WHERE "totalQuestions" > 0 AND duration IS NOT NULL
                               AND duration < 30 * "totalQuestions") AS fast
          FROM "SoloSession"
          WHERE "userId" = ${userId} AND "endedAt" IS NOT NULL`,
      ]);
      if (!user) return;

      const progressByType = {
        quiz: Number(solo.perfect),    // Big Brain: 100% score in N solo sessions
        speed: Number(solo.fast),      // Speed Demon: under 30s per question in N sessions
        streak: user.longestStreak,    // Streak God: N-day activity streak
        battle: user.matchesWon,       // Battle Royale: N battle wins
      };

      for (const achievement of achievements) {
        const progress = progressByType[achievement.type];
        if (progress === undefined) continue;

        const prev = existing.find((ua) => ua.achievementId === achievement.id);
        const unlocked = Boolean(prev?.unlocked) || progress >= achievement.goal;
        if (prev && prev.progress === progress && prev.unlocked === unlocked) continue;

        await prisma.userAchievement.upsert({
          where: { userId_achievementId: { userId, achievementId: achievement.id } },
          update: { progress, unlocked },
          create: { userId, achievementId: achievement.id, progress, unlocked },
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Get achievements for a user
  static async getUserAchievements(userId) {
    try {
      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: true
        }
      });

      // Get all achievements and merge with user progress
      const allAchievements = await prisma.achievement.findMany();

      return allAchievements.map(achievement => {
        const userAchievement = userAchievements.find(
          ua => ua.achievementId === achievement.id
        );

        return {
          id: achievement.id,
          name: achievement.name,
          slug: achievement.slug,
          emoji: achievement.emoji,
          description: achievement.description,
          goal: achievement.goal,
          type: achievement.type,
          progress: userAchievement?.progress || 0,
          unlocked: userAchievement?.unlocked || false,
          updatedAt: userAchievement?.updatedAt || null
        };
      });

    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }
}

export default AchievementService;
