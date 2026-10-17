import prisma from '../db/prismaClient.js';
import AchievementService, { streakUpdate } from '../services/achievementService.js';
import { pickQuestionIds } from '../services/questionPool.js';

const XP_PER_CORRECT = 20;
const DIFFICULTY_MULTIPLIER = { easy: 1.0, medium: 1.5, hard: 2.0 };
const TIMED_MODE_MULTIPLIER = 1.25;

function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Starts a solo session. The served questions are recorded as SoloAnswer rows (with the correct
// answer server-side), so grading at the end never trusts the client.
export const getSoloPracticeQuestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categories, mode, difficulty, questionCount } = req.query; // validated by middleware
    const categoryList = [...new Set(categories.split(',').map((c) => c.trim()).filter(Boolean))];

    const ids = shuffle(await pickQuestionIds({
      categories: categoryList,
      difficulty: difficulty.toUpperCase(),
      count: questionCount,
    }));
    if (!ids.length) {
      return res.status(404).json({ error: 'No questions found for selected categories' });
    }

    const byId = new Map((await prisma.question.findMany({ where: { id: { in: ids } } })).map((q) => [q.id, q]));
    const questions = ids.map((id) => byId.get(id)).filter(Boolean);

    const session = await prisma.$transaction(async (tx) => {
      const created = await tx.soloSession.create({
        data: {
          userId,
          totalQuestions: questions.length,
          correctAnswers: 0,
          mode: mode === 'timed' ? 'TIMED' : 'ACCURACY',
          difficulty: difficulty.toLowerCase(),
          categories: categoryList,
        },
      });
      const base = Date.now();
      await tx.soloAnswer.createMany({
        data: questions.map((q, i) => ({
          soloSessionId: created.id,
          questionId: q.id,
          questionText: q.text,
          questionOptions: q.options,
          correctAnswer: q.answer,
          correct: false,
          createdAt: new Date(base + i), // preserves the served order
        })),
      });
      return created;
    });

    res.status(200).json({
      success: true,
      mode,
      categories: categoryList,
      difficulty,
      soloSessionId: session.id,
      // No answers: grading happens server-side in endSoloSession
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        type: q.type,
        categories: q.categories,
        difficulty: q.difficulty,
      })),
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const endSoloSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { soloSessionId, answers } = req.body; // validated by middleware

    const session = await prisma.soloSession.findUnique({
      where: { id: soloSessionId },
      include: { answers: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session || session.userId !== userId) {
      return res.status(404).json({ error: 'Session not found' });
    }
    if (session.endedAt) {
      return res.status(409).json({ error: 'Session already ended' });
    }
    if (session.answers.length === 0) {
      // Created before server-side grading existed; nothing to grade against
      return res.status(409).json({ error: 'Session expired, please start a new one' });
    }

    const submitted = new Map(answers.map((a) => [a.questionId, a.answer]));
    const graded = session.answers.map((row) => {
      const userAnswer = submitted.get(row.questionId) ?? null;
      return { row, userAnswer, correct: userAnswer !== null && userAnswer === row.correctAnswer };
    });
    const score = graded.filter((g) => g.correct).length;
    const answeredCount = graded.filter((g) => g.userAnswer !== null).length;

    const now = new Date();
    const duration = Math.round((now.getTime() - session.startedAt.getTime()) / 1000);
    const xpEarned = Math.floor(
      score * XP_PER_CORRECT
      * (DIFFICULTY_MULTIPLIER[session.difficulty.toLowerCase()] ?? 1)
      * (session.mode === 'TIMED' ? TIMED_MODE_MULTIPLIER : 1)
    );

    const ended = await prisma.$transaction(async (tx) => {
      // Conditional on endedAt so concurrent requests can't both award XP
      const { count } = await tx.soloSession.updateMany({
        where: { id: session.id, endedAt: null },
        data: { correctAnswers: score, endedAt: now, duration, xpEarned },
      });
      if (count === 0) return false;

      for (const g of graded) {
        if (g.userAnswer === null) continue;
        await tx.soloAnswer.update({ where: { id: g.row.id }, data: { userAnswer: g.userAnswer, correct: g.correct } });
      }
      const streak = await streakUpdate(tx, userId, now, { excludeSoloSessionId: session.id });
      await tx.user.update({
        where: { id: userId },
        data: {
          ...streak,
          xp: { increment: xpEarned },
          correctAnswers: { increment: score },
          totalAnswers: { increment: answeredCount },
        },
      });
      return true;
    }, { timeout: 15_000 });
    if (!ended) {
      return res.status(409).json({ error: 'Session already ended' });
    }

    await AchievementService.checkAchievements(userId);

    res.status(200).json({
      success: true,
      soloSessionId: session.id,
      correctAnswers: score,
      totalQuestions: session.totalQuestions,
      duration,
      xpEarned,
      mode: session.mode,
      difficulty: session.difficulty,
      categories: session.categories,
      endedAt: now,
      questionResults: graded.map((g) => ({
        id: g.row.questionId,
        text: g.row.questionText,
        options: g.row.questionOptions,
        correctAnswer: g.row.correctAnswer,
        userAnswer: g.userAnswer,
        userCorrect: g.correct,
      })),
    });
  } catch (error) {
    console.error('Error ending solo session:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
