import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const userId = randomUUID();

  const email = `user${Math.floor(Math.random() * 10000)}@algowars.io`;
  const username = `user_${Math.floor(Math.random() * 10000)}`;
  const xp = Math.floor(Math.random() * 1000);
  const streak = Math.floor(Math.random() * 30);

  const user = await prisma.user.create({
    data: {
      id: userId,
      email,
      username,
      xp,
      streak,
    },
  });

  // Add some achievements
  const achievements = await prisma.achievement.findMany({ take: 2 }); // pick 2 achievements if exist

  for (const achievement of achievements) {
    await prisma.userAchievement.create({
      data: {
        userId: user.id,
        achievementId: achievement.id,
        progress: Math.floor(Math.random() * achievement.goal),
        unlocked: Math.random() < 0.95, // 95% chance unlocked
      },
    });
  }

  // Add solo sessions
  const soloSessionsData = Array.from({ length: 3 }).map(() => ({
    userId: user.id,
    totalQuestions: 10,
    correctAnswers: Math.floor(Math.random() * 11),
    duration: Math.floor(Math.random() * 300),
    mode: Math.random() < 0.5 ? 'TIMED' : 'ACCURACY',
    difficulty: ['EASY', 'MEDIUM', 'HARD'][Math.floor(Math.random() * 3)],
    categories: ['arrays', 'strings', 'dp'].sort(() => 0.5 - Math.random()).slice(0, 2),
    xpEarned: Math.floor(Math.random() * 500),
    endedAt: new Date(),
  }));

  await prisma.soloSession.createMany({ data: soloSessionsData });

  console.log('✅ Created user with ID:', user.id);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
