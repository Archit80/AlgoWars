import prisma from '../db/prismaClient.js';

// Toggle save/unsave a question - Simple and clean
export const toggleSaveQuestion = async (req, res) => {
  try {
  const { userId, questionId, savedFrom, userAnswer, wasCorrect } = req.body;
    
    if (!userId || !questionId) {
      return res.status(400).json({ error: 'userId and questionId are required' });
    }

    // Check if question exists
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if already saved
    const existingSaved = await prisma.savedQuestion.findUnique({
      where: { userId_questionId: { userId, questionId } }
    });

    if (existingSaved) {
      // UNSAVE: Remove from saved questions
      await prisma.savedQuestion.delete({
        where: { id: existingSaved.id }
      });

      return res.json({
        success: true,
        action: 'unsaved',
        isSaved: false,
        message: 'Question removed from saved collection'
      });
    } else {
      // SAVE: Add to saved questions
      const savedQuestion = await prisma.savedQuestion.create({
        data: {
          userId,
          questionId,
          savedFrom: savedFrom || 'BATTLE_RESULT',
          userAnswer,
          wasCorrect: wasCorrect || false
        }
      });

      return res.json({
        success: true,
        action: 'saved',
        isSaved: true,
        message: 'Question saved successfully'
      });
    }

  } catch (error) {
    console.error('toggleSaveQuestion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Batch check if multiple questions are saved (for result pages)
export const checkMultipleSaved = async (req, res) => {
  try {
    const { userId } = req.params;
    const { questionIds } = req.body; // Array of question IDs

    if (!Array.isArray(questionIds)) {
      return res.status(400).json({ error: 'questionIds must be an array' });
    }

    const savedQuestions = await prisma.savedQuestion.findMany({
      where: {
        userId,
        questionId: { in: questionIds }
      },
      select: { questionId: true }
    });

    // Create a map of questionId -> isSaved
    const savedMap = {};
    questionIds.forEach(id => savedMap[id] = false);
    savedQuestions.forEach(saved => savedMap[saved.questionId] = true);

    res.json({
      success: true,
      savedMap
    });

  } catch (error) {
    console.error('checkMultipleSaved error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's saved questions (simple list)
export const getSavedQuestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [savedQuestions, totalCount] = await Promise.all([
      prisma.savedQuestion.findMany({
        where: { userId },
        include: {
          question: {
            select: {
              id: true,
              text: true,
              options: true,
              categories: true,
              difficulty: true,
              type: true,
              answer: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.savedQuestion.count({ where: { userId } })
    ]);

    res.json({
      success: true,
      savedQuestions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount
      }
    });

  } catch (error) {
    console.error('getSavedQuestions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
