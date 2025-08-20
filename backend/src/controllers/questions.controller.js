import prisma from '../db/prismaClient.js';
import AchievementService from '../services/achievementService.js';

export const endSoloSession = async (req, res) => {
  try {
    const { soloSessionId, score, total, duration, mode, questionResults } = req.body;
    if (!soloSessionId || score == null || total == null) {
      return res.status(400).json({ error: 'soloSessionId, score, and total are required' });
    }

    // Calculate XP based on difficulty and mode
    // Difficulty can be 'easy', 'medium', 'hard' (from frontend)
    let difficultyMultiplier = 1.0;
    if (req.body.difficulty) {
      const diff = req.body.difficulty.toLowerCase();
      if (diff === 'easy') difficultyMultiplier = 1.0;
      else if (diff === 'medium') difficultyMultiplier = 1.5;
      else if (diff === 'hard') difficultyMultiplier = 2.0;
    }
    let baseXP = score * 20 * difficultyMultiplier;
    let xpMultiplier = mode === 'timed' ? 1.25 : 1.0; // 25% bonus for timed mode
    const xpEarned = Math.floor(baseXP * xpMultiplier);

    // Update the SoloSession
    const updatedSession = await prisma.soloSession.update({
      where: { id: soloSessionId },
      data: {
        correctAnswers: score,
        endedAt: new Date(),
        duration: duration || null,
        xpEarned,
      },
    });

    // Update user's XP and explicit counters
    const user = await prisma.user.update({
      where: { id: updatedSession.userId },
      data: {
        xp: { increment: xpEarned }, // Increment user's XP
        correctAnswers: { increment: score }, // Update explicit counter
        totalAnswers: { increment: total }, // Update explicit counter
      }
    });

    // Update streak and check achievements after solo session completion
    await AchievementService.updateUserStreak(updatedSession.userId);
    await AchievementService.checkAchievements(updatedSession.userId);

    // Return session stats with question results
    res.status(200).json({
      success: true,
      soloSessionId,
      correctAnswers: updatedSession.correctAnswers,
      totalQuestions: updatedSession.totalQuestions,
      duration: updatedSession.duration,
      xpEarned: updatedSession.xpEarned,
      mode: updatedSession.mode,
      difficulty: updatedSession.difficulty,
      categories: updatedSession.categories,
      endedAt: updatedSession.endedAt,
      questionResults: questionResults || [], // Include question-by-question results
    });
  } catch (error) {
    console.error('Error ending solo session:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSoloPracticeQuestions = async (req, res) => {
  try {
    const { categories, mode, userId, difficulty, questionCount } = req.query;

    if (!categories || !mode || !userId || !difficulty) {
      return res.status(400).json({ error: 'Categories, mode, userId, and difficulty are required' });
    }

    // Parse categories if it's a string (comma-separated)
    const categoryArray = typeof categories === 'string' ? categories.split(',') : categories;
    const questionsPerCategory = Math.ceil((questionCount || 10) / categoryArray.length);

    console.log('[Backend] Fetching questions for:', { categoryArray, mode, difficulty, questionCount });

    // Fetch questions from all selected categories
    const allQuestions = [];
    for (const category of categoryArray) {
      const questions = await prisma.question.findMany({
        where: { 
          categories: { has: category.trim() },
          difficulty: difficulty.toUpperCase()  
        },
        take: questionsPerCategory * 2, // Get more to allow for better shuffling
      });
      allQuestions.push(...questions);
    }

    if (!allQuestions.length) {
      return res.status(404).json({ error: 'No questions found for selected categories' });
    }

    // Shuffle and select the requested number of questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, questionCount || 10);

    // Map mode from frontend to backend enum
    const modeMapping = {
      'timed': 'TIMED',
      'accuracy': 'ACCURACY'
    };

    // Create a new SoloSession with enhanced data
    const soloSession = await prisma.soloSession.create({
      data: {
        userId,
        totalQuestions: selected.length,
        correctAnswers: 0,
        duration: null,
        mode: modeMapping[mode] || 'ACCURACY',
        difficulty: difficulty,
        categories: categoryArray,
        xpEarned: 0,
      },
    });

    console.log('[Backend] Created solo session:', soloSession);

    res.status(200).json({
      success: true,
      mode,
      categories: categoryArray,
      difficulty,
      soloSessionId: soloSession.id,
      questions: selected.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
        answer: q.answer,
        type: q.type,
        categories: q.categories,
      })),
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
