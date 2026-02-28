import prisma from '../db/prismaClient.js';
import { getIO, cleanupMatch, ensureMatchTimer, resetMatchTimer, updateMatchCache } from '../sockets/io.js';
import { enqueuePlayer, findMatchForPlayer, removePlayer, getQueueSize } from "../utils/matchmakingQueue.js";
import AchievementService from '../services/achievementService.js';
 
const QUESTIONS_PER_MATCH = 5;


function normalizeDifficulty(d) {
  const up = (d || 'MEDIUM').toString().toUpperCase();
  return ['EASY', 'MEDIUM', 'HARD'].includes(up) ? up : 'MEDIUM';
}

function generateRoomCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function pickQuestions(categories, difficulty, count = QUESTIONS_PER_MATCH) {
  // Prefer DB-side random sampling (Postgres) for efficiency and uniformity.
  const allRows = [];
  const perCat = Math.max(1, Math.ceil(count / Math.max(1, (categories || []).length)));

  // If categories is empty, skip per-category queries and use fallback below.
  if (Array.isArray(categories) && categories.length > 0) {
    for (const cat of categories) {
      try {
        // Use Postgres ANY() to check membership and ORDER BY random() for random sample
        const rows = await prisma.$queryRaw`
          SELECT id FROM "Question"
          WHERE ${cat} = ANY(categories) AND difficulty = ${difficulty}
          ORDER BY random()
          LIMIT ${perCat};
        `;
        allRows.push(...rows);
      } catch (err) {
        // Fallback to Prisma findMany if raw query fails for any reason
        const rows = await prisma.question.findMany({ where: { categories: { has: cat }, difficulty }, take: perCat });
        allRows.push(...rows.map(r => ({ id: r.id })));
      }
    }
  }

  // If we didn't collect any rows from categories, fallback to difficulty-only sampling
  if (allRows.length === 0) {
    const fallback = await prisma.$queryRaw`
      SELECT id FROM "Question"
      WHERE difficulty = ${difficulty}
      ORDER BY random()
      LIMIT ${count * 2};
    `;
    allRows.push(...fallback);
  }

  // Deduplicate by id while preserving order
  const seen = new Set();
  const uniqueIds = [];
  for (const r of allRows) {
    const id = r.id || r.ID || r._id;
    if (!id) continue;
    if (!seen.has(id)) {
      seen.add(id);
      uniqueIds.push(id);
    }
    if (uniqueIds.length >= count) break;
  }

  return uniqueIds.slice(0, count);
}

export const createFriendMatch = async (req, res) => {
  try {
    const { userId, topics = [], difficulty } = req.body || {};
    if (!userId || !Array.isArray(topics) || topics.length === 0)
      return res.status(400).json({ error: 'userId and topics[] are required' });

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const diff = normalizeDifficulty(difficulty);
    let roomCode;
    for (let i = 0; i < 5; i++) {
      const candidate = generateRoomCode(6 + Math.floor(Math.random() * 3));
      const exists = await prisma.match.findUnique({ where: { roomCode: candidate } });
      if (!exists) { roomCode = candidate; break; }
    }
    if (!roomCode) return res.status(500).json({ error: 'Could not allocate room code' });

    const match = await prisma.match.create({
      data: {
        user1Id: userId,
        user2Id: null,
        isPrivate: true,
        roomCode,
        categories: topics,
        difficulty: diff,
        status: 'WAITING',
      },
      include: { user1: { select: { username: true } }, user2: { select: { username: true } } },
    });

    return res.json({ 
      success: true, 
      matchId: match.id, 
      roomCode, 
      match: {
        ...match,
        user1Username: match.user1?.username || match.user1Id,
        user2Username: match.user2?.username || match.user2Id,
      }
    });
  } catch (e) {
    console.error('createFriendMatch error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const joinFriendMatch = async (req, res) => {
  try {
    const { userId, roomCode } = req.body || {};
    if (!userId || !roomCode) return res.status(400).json({ error: 'userId and roomCode are required' });

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await prisma.match.findUnique({ where: { roomCode } });
    if (!match || !match.isPrivate) return res.status(404).json({ error: 'Match not found' });
    if (match.user2Id) return res.status(400).json({ error: 'Room already full' });
    if (match.user1Id === userId) return res.status(400).json({ error: 'Cannot join your own match' });

    const questionIds = await pickQuestions(match.categories, match.difficulty);
    const updated = await prisma.match.update({
      where: { id: match.id },
      data: {
        user2Id: userId,
        status: 'ONGOING',
        questions: { connect: questionIds.map((id) => ({ id })) },
      },
      include: { questions: true, user1: { select: { username: true } }, user2: { select: { username: true } } },
    });

    // Notify user1 (already in their user room) that the match is ready
    try {
      const io = getIO();
      if (io) {
        io.to(updated.user1Id).emit('match:started', { matchId: updated.id });
      }
    } catch {}

    return res.json({
      success: true,
      match: {
        ...updated,
        user1Username: updated.user1?.username || updated.user1Id,
        user2Username: updated.user2?.username || updated.user2Id,
      }
    });
  } catch (e) {
    console.error('joinFriendMatch error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export async function joinRandomMatch(req, res) {
  try {
    const { userId, topics = [], difficulty, xp = 0 } = req.body;
    if (!userId || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'userId and topics[] are required' });
    }

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // FIRST: Remove any existing entries for this user
    await removePlayer(userId);

    const player = { 
      userId, 
      username: user.username, 
      topics, 
      xp: user.xp || xp 
    };

    console.log('Looking for match for player:', player);

    // Try to find a match
    const opponent = await findMatchForPlayer(player);
    console.log('Found opponent:', opponent);

    if (opponent) {
      // Match found - create match in DB
      const diff = normalizeDifficulty(difficulty);

      // Use intersection of both players' topics so questions reflect both preferences
      const intersection = Array.isArray(topics) && Array.isArray(opponent.topics)
        ? topics.filter((t) => opponent.topics.includes(t))
        : [];
      const categoriesToUse = intersection.length ? intersection : topics;

      const questionIds = await pickQuestions(categoriesToUse, diff);

      const match = await prisma.match.create({
        data: {
          user1Id: opponent.userId,
          user2Id: player.userId,
          isPrivate: false,
          categories: categoriesToUse,
          difficulty: diff,
          status: 'ONGOING',
          questions: { connect: questionIds.map((id) => ({ id })) },
        },
        include: { questions: true, user1: { select: { username: true } }, user2: { select: { username: true } } },
      });

      // Notify both players via socket
      try {
        const io = getIO();
        if (io) {
          io.to(opponent.userId).emit("match:found", { matchId: match.id, opponent: player });
          io.to(player.userId).emit("match:found", { matchId: match.id, opponent });
          // Don't emit match:started here — neither player has joined the match room yet.
          // It will be triggered when both players join via match:join socket event.
        }
      } catch (err) {
        console.error('[Random Match] Socket emission error:', err);
      }

      return res.json({
        success: true,
        status: "matched",
        matchId: match.id,
        match: {
          ...match,
          user1Username: match.user1?.username || match.user1Id,
          user2Username: match.user2?.username || match.user2Id,
        }
      });
    } else {
      // No match found - add to queue
      await enqueuePlayer(player);
      console.log('Added to queue, current queue size:', await getQueueSize());
      return res.json({ success: true, status: "waiting" });
    }
  } catch (error) {
    console.error('joinRandomMatch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export const getMatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: { questions: true, user1: { select: { username: true } }, user2: { select: { username: true } } }
    });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    return res.json({
      success: true,
      status: match.status,
      isReady: match.status === 'ONGOING',
      match: {
        ...match,
        user1Username: match.user1?.username || match.user1Id,
        user2Username: match.user2?.username || match.user2Id,
      }
    });
  } catch (e) {
    console.error('getMatchStatus error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMatchUsernames = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } },
      },
    });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    return res.json({
      success: true,
      matchId: match.id,
      user1Id: match.user1Id,
      user2Id: match.user2Id,
      user1Username: match.user1?.username || match.user1Id,
      user2Username: match.user2?.username || match.user2Id,
    });
  } catch (e) {
    console.error('getMatchUsernames error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getMatchQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: { questions: true, user1: { select: { username: true } }, user2: { select: { username: true } } },
    });
    if (!match) return res.status(404).json({ error: 'Match not found' });

    // Hide answers for anti-cheat until revealed per question
    const questions = match.questions.map(q => ({
      id: q.id,
      text: q.text,
      options: q.options,
      categories: q.categories,
      difficulty: q.difficulty,
      type: q.type,
    }));
    return res.json({
      success: true,
      questions,
      currentIndex: match.currentIndex,
      user1Username: match.user1?.username || match.user1Id,
      user2Username: match.user2?.username || match.user2Id,
    });
  } catch (e) {
    console.error('getMatchQuestions error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};


// NOTE: In-memory live state is now consolidated in io.js matchTimers.
// Use updateMatchCache() to sync state between controller and socket layer.

// Forfeit logic: called when a user exits or times out
export async function forfeitMatch(matchId, exiterId) {
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || match.status !== 'ONGOING') return;

  // Determine stayer
  const stayerId = match.user1Id === exiterId ? match.user2Id : match.user1Id;
  if (!stayerId) {
    // If no stayer, just end match
    await prisma.match.update({
      where: { id: matchId },
      data: {
        user1Score: match.user1Id === exiterId ? 0 : match.user1Score,
        user2Score: match.user2Id === exiterId ? 0 : match.user2Score,
        status: 'COMPLETED'
      }
    });
    return;
  }

  // Set exiter score to 0, stayer keeps their score
  const user1Score = match.user1Id === exiterId ? 0 : match.user1Score;
  const user2Score = match.user2Id === exiterId ? 0 : match.user2Score;
  const winnerId = stayerId;

  // Get match questions count for totalAnswers
  const matchWithQuestions = await prisma.match.findUnique({
    where: { id: matchId },
    include: { questions: true }
  });
  const totalQuestions = matchWithQuestions.questions.length;

  // XP logic (same as normal win)
  const perQuestionXP = 25;
  const baseXP = 50;
  const winBonus = 100;
  const user1IsWinner = winnerId === match.user1Id;
  const user2IsWinner = winnerId === match.user2Id;
  const user1EarnedXP = Math.floor(baseXP + (user1Score * perQuestionXP) + (user1IsWinner ? winBonus : 0));
  const user2EarnedXP = match.user2Id ? Math.floor(baseXP + (user2Score * perQuestionXP) + (user2IsWinner ? winBonus : 0)) : 0;

  const user1Updates = {
    xp: { increment: user1EarnedXP },
    totalMatches: { increment: 1 },
    correctAnswers: { increment: user1Score },
    totalAnswers: { increment: totalQuestions },
    lastMatchAt: new Date(),
    ...(user1IsWinner && { matchesWon: { increment: 1 } }),
    ...(winnerId && !user1IsWinner && { matchesLost: { increment: 1 } })
  };

  const user2Updates = match.user2Id ? {
    xp: { increment: user2EarnedXP },
    totalMatches: { increment: 1 },
    correctAnswers: { increment: user2Score },
    totalAnswers: { increment: totalQuestions },
    lastMatchAt: new Date(),
    ...(user2IsWinner && { matchesWon: { increment: 1 } }),
    ...(winnerId && !user2IsWinner && { matchesLost: { increment: 1 } })
  } : null;

  await prisma.$transaction([
    prisma.match.update({
      where: { id: matchId },
      data: {
        user1Score,
        user2Score,
        winnerId,
        status: 'COMPLETED'
      }
    }),
    prisma.user.update({ where: { id: match.user1Id }, data: user1Updates }),
    ...(user2Updates ? [prisma.user.update({ where: { id: match.user2Id }, data: user2Updates })] : [])
  ]);

  // Update streaks and achievements for both users
  await AchievementService.updateUserStreak(match.user1Id);
  await AchievementService.checkAchievements(match.user1Id);
  if (match.user2Id) {
    await AchievementService.updateUserStreak(match.user2Id);
    await AchievementService.checkAchievements(match.user2Id);
  }

  // Emit match completed event via socket
  try {
    const io = getIO();
    if (io) {
      io.to(matchId).emit('match:completed', {
        matchId,
        winnerId,
        user1Score,
        user2Score,
        forfeit: true,
        exiterId
      });
      setTimeout(() => cleanupMatch(matchId), 5000);
    }
  } catch (err) {
    console.error('Socket emission error (forfeit):', err);
  }
}

export const submitMatchAnswer = async (req, res) => {
  try {
    const { id: matchId } = req.params;
    const { userId, questionId, answer } = req.body || {};
    if (!matchId || !userId || !questionId || typeof answer !== 'string') {
      return res.status(400).json({ error: 'matchId, userId, questionId and answer are required' });
    }

    // Load match with questions
    const match = await prisma.match.findUnique({ where: { id: matchId }, include: { questions: true } });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    if (match.status !== 'ONGOING') return res.status(400).json({ error: 'Match not active' });

    if (![match.user1Id, match.user2Id].includes(userId)) {
      return res.status(403).json({ error: 'User is not part of this match' });
    }

    // Enforce current question index
    const currentQuestion = match.questions[match.currentIndex];
    if (!currentQuestion || currentQuestion.id !== questionId) {
      return res.status(400).json({ error: 'Not current question' });
    }

    // Get correct answer securely from DB
    const fullQuestion = await prisma.question.findUnique({ where: { id: questionId } });
    if (!fullQuestion) return res.status(404).json({ error: 'Question not found' });
    const correct = fullQuestion.answer === answer;

    // Upsert answer (prevent duplicates)
    let created;
    try {
      created = await prisma.matchAnswer.create({
        data: { matchId, userId, questionId, answer, correct },
      });
    } catch (e) {
      // Unique constraint -> already answered
      return res.status(400).json({ error: 'Already answered' });
    }

    // Update match cache in io.js (consolidated state)
    updateMatchCache(matchId, {
      user1Score: userId === match.user1Id && correct ? match.user1Score + 1 : match.user1Score,
      user2Score: userId === match.user2Id && correct ? match.user2Score + 1 : match.user2Score,
    });

    // Check if both users have now answered this question
    const totalAnswers = await prisma.matchAnswer.count({ where: { matchId, questionId } });
    const bothAnswered = totalAnswers === 2;
    
    console.log(`Match ${matchId}: Question ${questionId} - Total answers: ${totalAnswers}, Both answered: ${bothAnswered}`);

    let advance = false;
    let completed = false;
    let newIndex = match.currentIndex;

    if (bothAnswered) {
      if (match.currentIndex + 1 < match.questions.length) {
        newIndex = match.currentIndex + 1;
        advance = true;
        console.log(`Match ${matchId}: Advancing to question ${newIndex}`);
      } else {
        completed = true;
        console.log(`Match ${matchId}: Match completed`);
      }
    }

    const updateData = {
      user1Score: userId === match.user1Id && correct ? match.user1Score + 1 : match.user1Score,
      user2Score: userId === match.user2Id && correct ? match.user2Score + 1 : match.user2Score,
      ...(advance || completed ? { currentIndex: newIndex } : {}),
      status: completed ? 'COMPLETED' : match.status,
    };

    console.log(`Match ${matchId}: Updating with data:`, updateData);

    const updated = await prisma.match.update({ where: { id: matchId }, data: updateData });

    // If completed, determine winner & XP (simple formula)
    if (completed) {
      let winnerId = null;
      if (updated.user1Score > updated.user2Score) winnerId = updated.user1Id;
      else if (updated.user2Score > updated.user1Score) winnerId = updated.user2Id;
      
      // Get match questions count for totalAnswers
      const matchWithQuestions = await prisma.match.findUnique({
        where: { id: matchId },
        include: { questions: true }
      });
      const totalQuestions = matchWithQuestions.questions.length;
      
      // Update match winner, XP, and user stats atomically (more rewarding)
      const perQuestionXP = 25; // 35% higher than solo sprint
      const baseXP = 50;
      const winBonus = 100;
      const user1IsWinner = winnerId === updated.user1Id;
      const user2IsWinner = winnerId === updated.user2Id;
      const user1EarnedXP = Math.floor(baseXP + (updated.user1Score * perQuestionXP) + (user1IsWinner ? winBonus : 0));
      const user2EarnedXP = updated.user2Id ? Math.floor(baseXP + (updated.user2Score * perQuestionXP) + (user2IsWinner ? winBonus : 0)) : 0;

      const user1Updates = {
        xp: { increment: user1EarnedXP },
        totalMatches: { increment: 1 },
        correctAnswers: { increment: updated.user1Score },
        totalAnswers: { increment: totalQuestions },
        lastMatchAt: new Date(),
        ...(user1IsWinner && { matchesWon: { increment: 1 } }),
        ...(winnerId && !user1IsWinner && { matchesLost: { increment: 1 } })
      };

      const user2Updates = updated.user2Id ? {
        xp: { increment: user2EarnedXP },
        totalMatches: { increment: 1 },
        correctAnswers: { increment: updated.user2Score },
        totalAnswers: { increment: totalQuestions },
        lastMatchAt: new Date(),
        ...(user2IsWinner && { matchesWon: { increment: 1 } }),
        ...(winnerId && !user2IsWinner && { matchesLost: { increment: 1 } })
      } : null;

      await prisma.$transaction([
        prisma.match.update({ where: { id: matchId }, data: { winnerId } }),
        prisma.user.update({ where: { id: updated.user1Id }, data: user1Updates }),
        ...(user2Updates ? [prisma.user.update({ where: { id: updated.user2Id }, data: user2Updates })] : [])
      ]);

      // Update streaks and check achievements for both users
      await AchievementService.updateUserStreak(updated.user1Id);
      await AchievementService.checkAchievements(updated.user1Id);
      
      if (updated.user2Id) {
        await AchievementService.updateUserStreak(updated.user2Id);
        await AchievementService.checkAchievements(updated.user2Id);
      }
    }

    // Broadcast + reveal if both answered
    try {
      const io = getIO();
      if (io) {
        // Use post-update scores (from `updated` object, not stale `match`)
        io.to(matchId).emit('match:answer', {
          matchId,
          userId,
          questionId,
          correct,
          user1Score: updated.user1Score,
          user2Score: updated.user2Score,
          userScore: userId === match.user1Id ? updated.user1Score : updated.user2Score,
          currentIndex: newIndex,
          completed,
        });
        if (advance && !completed) {
          io.to(matchId).emit('match:state', { matchId, currentIndex: newIndex });
          resetMatchTimer(matchId);
          // Sync the cache in io.js
          updateMatchCache(matchId, { currentIndex: newIndex });
        }
        if (completed) {
          const final = await prisma.match.findUnique({ where: { id: matchId } });
          io.to(matchId).emit('match:completed', {
            matchId,
            winnerId: final.winnerId,
            user1Score: final.user1Score,
            user2Score: final.user2Score,
          });
          setTimeout(() => cleanupMatch(matchId), 5000);
        }
      }
    } catch (err) {
      console.error('Socket emission error:', err);
    }

  // Ensure timer running
  ensureMatchTimer(matchId);

  return res.json({ success: true, correct, currentIndex: newIndex, completed });
  } catch (e) {
    console.error('submitMatchAnswer error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMatchState = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await prisma.match.findUnique({ where: { id }, include: { questions: true } });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    return res.json({
      success: true,
      status: match.status,
      currentIndex: match.currentIndex,
      total: match.questions.length,
      user1Score: match.user1Score,
      user2Score: match.user2Score,
      winner: { id: match.winnerId, username: match.winner?.username },
    });
  } catch (e) {
    console.error('getMatchState error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMatchResult = async (req, res) => {
  try {
    const { id: matchId } = req.params;
    const { userId } = req.query;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } },
        questions: true,
        answers: {
          include: {
            question: true,
            user: { select: { id: true, username: true } }
          }
        }
      }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Match not completed yet' });
    }

    // Determine winner
    let winner = null;
    if (match.user1Score > match.user2Score) {
      winner = match.user1;
    } else if (match.user2Score > match.user1Score) {
      winner = match.user2;
    }
    // else it's a tie

    // Calculate user's score and XP
    const isUser1 = userId === match.user1Id;
    const userScore = isUser1 ? match.user1Score : match.user2Score;
    const opponentScore = isUser1 ? match.user2Score : match.user1Score;
    
    // XP calculation: base 50 + 1.35*20 per correct + 100 bonus for win
    let xpEarned = Math.floor(50 + (userScore * 1.35 * 20));
    if (winner && winner.id === userId) {
      xpEarned += 100; // Win bonus
    }

    // Organize answers by question
    const questionResults = match.questions.map(question => {
      const userAnswer = match.answers.find(a => a.questionId === question.id && a.userId === userId);
      const opponentAnswer = match.answers.find(a => a.questionId === question.id && a.userId !== userId);
      
      return {
        id: question.id,
        text: question.text,
        options: question.options,
        correctAnswer: question.answer,
        userAnswer: userAnswer?.answer || null,
        userCorrect: userAnswer?.correct || false,
        opponentAnswer: opponentAnswer?.answer || null,
        opponentCorrect: opponentAnswer?.correct || false
      };
    });

    res.json({
      success: true,
      match: {
        id: match.id,
        categories: match.categories,
        difficulty: match.difficulty,
        totalQuestions: match.questions.length
      },
      winner,
      userScore,
      opponentScore,
      xpEarned,
      questionResults,
      user1: match.user1,
      user2: match.user2
    });

  } catch (error) {
    console.error('getMatchResult error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};