import prisma from "../src/db/prismaClient.js";

const achievements = [
  {
    name: "Big Brain",
    slug: "big-brain",
    emoji: "🧠",
    description: "Score 100% in 5 quizzes.",
    goal: 5,
    type: "quiz"
  },
  {
    name: "Streak God",
    slug: "streak-god", 
    emoji: "🔥",
    description: "Maintain a 30-day login streak.",
    goal: 30,
    type: "streak"
  },
  {
    name: "Speed Demon",
    slug: "speed-demon",
    emoji: "⏱️", 
    description: "Solve 10 questions under 30 seconds.",
    goal: 10,
    type: "speed"
  },
  {
    name: "Battle Royale",
    slug: "battle-royale",
    emoji: "⚔️",
    description: "Get 25 wins in 1v1 coding battles.",
    goal: 25,
    type: "battle"
  }
];

async function seedAchievements() {
  try {
    console.log("Seeding achievements...");
    
    for (const achievement of achievements) {
      const existing = await prisma.achievement.findUnique({
        where: { slug: achievement.slug }
      });
      
      if (!existing) {
        await prisma.achievement.create({
          data: achievement
        });
        console.log(`Created achievement: ${achievement.name}`);
      } else {
        console.log(`Achievement already exists: ${achievement.name}`);
      }
    }
    
    console.log("Achievement seeding completed!");
  } catch (error) {
    console.error("Error seeding achievements:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAchievements();
