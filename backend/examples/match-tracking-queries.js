// Examples of querying user's match history

// Get all matches for a user
const userMatches = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    matches1: {
      include: {
        user2: { select: { username: true } },
        answers: true
      }
    },
    matches2: {
      include: {
        user1: { select: { username: true } },
        answers: true
      }
    }
  }
});

// Get user's match statistics
const userStats = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    _count: {
      select: {
        matches1: true,
        matches2: true,
        matchAnswers: { where: { correct: true } }
      }
    },
    matches1: {
      where: { status: 'COMPLETED' },
      select: { winnerId: true, user1Score: true, user2Score: true }
    },
    matches2: {
      where: { status: 'COMPLETED' },
      select: { winnerId: true, user1Score: true, user2Score: true }
    }
  }
});

// Get user's recent matches with opponents
const recentMatches = await prisma.match.findMany({
  where: {
    OR: [
      { user1Id: userId },
      { user2Id: userId }
    ],
    status: 'COMPLETED'
  },
  include: {
    user1: { select: { username: true } },
    user2: { select: { username: true } }
  },
  orderBy: { createdAt: 'desc' },
  take: 10
});

// Get user's performance by difficulty
const performanceByDifficulty = await prisma.match.groupBy({
  by: ['difficulty'],
  where: {
    OR: [{ user1Id: userId }, { user2Id: userId }],
    status: 'COMPLETED'
  },
  _count: { id: true },
  _avg: { user1Score: true, user2Score: true }
});
