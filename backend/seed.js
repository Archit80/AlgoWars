import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const user1 = await prisma.user.upsert({
    where: { id: 'test-user-1' },
    update: {},
    create: {
      id: 'test-user-1',
      email: 'user1@example.com',
      username: 'TestUser1',
      xp: 100,
      streak: 5,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 'test-user-2' },
    update: {},
    create: {
      id: 'test-user-2',
      email: 'user2@example.com',
      username: 'TestUser2',
      xp: 150,
      streak: 3,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { id: 'test-user-3' },
    update: {},
    create: {
      id: 'test-user-3',
      email: 'user3@example.com',
      username: 'Archit',
      xp: 200,
      streak: 7,
    },
  });

  console.log('✅ Test users created:', { user1: user1.username, user2: user2.username, user3: user3.username });
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
