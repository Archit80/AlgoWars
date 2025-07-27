import prisma  from  "../db/prismaClient.js";  

export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: [
        { xp: "desc" },
      ],
      take: 10,
      select: {
        id: true,
        username: true,
        xp: true,
        streak: true,
      },
    });
    res.json({ success: true, data: topUsers });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ success: false, error: "Something broke." });
  }
};
