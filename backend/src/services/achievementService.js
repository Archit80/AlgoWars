import prisma from "../db/prismaClient.js";

export class AchievementService {
  
  // Check and update achievements for a user
  static async checkAchievements(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userAchievements: {
            include: {
              achievement: true
            }
          },
          soloSessions: true
        }
      });

      if (!user) return;

      // Get all achievements
      const allAchievements = await prisma.achievement.findMany();

      for (const achievement of allAchievements) {
        const existingUserAchievement = user.userAchievements.find(
          ua => ua.achievementId === achievement.id
        );

        let progress = 0;

        // Calculate progress based on achievement type
        switch (achievement.type) {
          case 'quiz':
            // Big Brain: Score 100% in 5 quizzes
            progress = user.soloSessions.filter(session => 
              session.totalQuestions > 0 && 
              session.correctAnswers === session.totalQuestions
            ).length;
            break;

          case 'streak':
            // Streak God: Maintain a 30-day login streak
            progress = user.streak;
            break;

          case 'speed':
            // Speed Demon: Solve 10 questions under 30 seconds
            progress = user.soloSessions.filter(session => 
              session.duration && session.totalQuestions > 0 &&
              (session.duration / session.totalQuestions) < 30
            ).length;
            break;

          case 'battle':
            // Battle Royale: Get 25 wins in 1v1 coding battles
            progress = user.matchesWon;
            break;

          default:
            continue;
        }

        const isUnlocked = progress >= achievement.goal;

        if (existingUserAchievement) {
          // Update existing achievement progress
          if (existingUserAchievement.progress !== progress || 
              (isUnlocked && !existingUserAchievement.unlocked)) {
            await prisma.userAchievement.update({
              where: { id: existingUserAchievement.id },
              data: {
                progress,
                unlocked: isUnlocked
              }
            });
          }
        } else {
          // Create new user achievement
          await prisma.userAchievement.create({
            data: {
              userId,
              achievementId: achievement.id,
              progress,
              unlocked: isUnlocked
            }
          });
        }
      }

    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Update streak tracking
  static async updateUserStreak(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) return;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Get user's last login from lastMatchAt or use a separate lastLoginAt field if needed
      const lastLogin = user.lastMatchAt ? new Date(user.lastMatchAt) : null;
      const lastLoginDate = lastLogin ? 
        new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate()) : null;

      let newStreak = user.streak;

      if (!lastLoginDate) {
        // First login
        newStreak = 1;
      } else {
        const daysDiff = Math.floor((today - lastLoginDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day, no change to streak
          return;
        } else if (daysDiff === 1) {
          // Next day, increment streak
          let newStreak = user.streak;
          // ...existing code...
          if (lastLogin) {
            const lastLoginDate = new Date(lastLogin);
            const today = new Date();
            // ...existing code...
            if (isSameDay(lastLoginDate, today)) {
              // Same day, no change to streak
            } else if (isNextDay(lastLoginDate, today)) {
              // Next day, increment streak
              newStreak = user.streak + 1;
            } else {
              // Streak broken, reset to 1
              newStreak = 1;
            }
          } else {
            newStreak = 1;
          }
          // Update user streak, longest streak, and last login
          await prisma.user.update({
            where: { id: userId },
            data: {
              streak: newStreak,
              longestStreak: Math.max(newStreak, user.longestStreak ?? 0),
              lastMatchAt: new Date(),
            },
          });
        } else {
          // Streak broken, reset to 1
          newStreak = 1;
          await prisma.user.update({
            where: { id: userId },
            data: {
              streak: newStreak,
              longestStreak: Math.max(newStreak, user.longestStreak ?? 0),
              lastMatchAt: new Date(),
            },
          });
        }
      }
    } catch (error) {
      console.error('Error updating user streak:', error);
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
