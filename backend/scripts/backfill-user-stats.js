import prisma from '../src/db/prismaClient.js';

// Backfill user stats for existing users
async function backfillUserStats() {
  console.log('🔄 Starting user stats backfill...');
  
  const users = await prisma.user.findMany({
    include: {
      matches1: { where: { status: 'COMPLETED' } },
      matches2: { where: { status: 'COMPLETED' } },
      matchAnswers: true
    }
  });

  console.log(`📊 Processing ${users.length} users...`);

  for (const user of users) {
    const allMatches = [...user.matches1, ...user.matches2];
    const totalMatches = allMatches.length;
    
    let matchesWon = 0;
    let matchesLost = 0;
    let lastMatchAt = null;

    for (const match of allMatches) {
      if (match.winnerId === user.id) matchesWon++;
      else if (match.winnerId && match.winnerId !== user.id) matchesLost++;
      
      if (!lastMatchAt || match.createdAt > lastMatchAt) {
        lastMatchAt = match.createdAt;
      }
    }

    const correctAnswers = user.matchAnswers.filter(a => a.correct).length;
    const totalAnswers = user.matchAnswers.length;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalMatches,
        matchesWon,
        matchesLost,
        correctAnswers,
        totalAnswers,
        lastMatchAt
      }
    });

    console.log(`✅ Updated ${user.username || user.id}: ${totalMatches} matches, ${matchesWon} wins`);
  }

  console.log('🎉 Backfill completed!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  backfillUserStats()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Backfill failed:', error);
      process.exit(1);
    });
}

export default backfillUserStats;
