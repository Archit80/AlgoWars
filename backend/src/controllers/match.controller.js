import prisma from '../db/prismaClient.js';
import { getIO } from '../sockets/io.js';
import { pickQuestionIds } from '../services/questionPool.js';
import { pairOrEnqueue, leaveQueue, recordFoundMatch, takeFoundMatch } from '../utils/matchmakingQueue.js';
import {
  ORDERED_QUESTIONS,
  MatchError,
  computeMatchXP,
  registerNewMatch,
  submitAnswer,
  getLiveClock,
} from '../services/matchEngine.js';

const QUESTIONS_PER_MATCH = 5;
const PLAYER_NAMES = { user1: { select: { username: true } }, user2: { select: { username: true } } };

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

// Never includes questions: they carry the correct answers. Clients fetch them via /questions.
function serializeMatch(match) {
  const { user1, user2, questions: _questions, ...rest } = match;
  return {
    ...rest,
    user1Username: user1?.username || match.user1Id,
    user2Username: user2?.username || match.user2Id,
  };
}

function pickQuestions(categories, difficulty) {
  return pickQuestionIds({ categories, difficulty, count: QUESTIONS_PER_MATCH, fillFromAnyCategory: true });
}

function sendMatchError(res, err, label) {
  if (err instanceof MatchError) return res.status(err.statusCode).json({ error: err.message });
  console.error(`${label} error:`, err);
  return res.status(500).json({ error: 'Server error' });
}

export const createFriendMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topics = [], difficulty } = req.body || {};
    if (!Array.isArray(topics) || topics.length === 0)
      return res.status(400).json({ error: 'topics[] is required' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

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
        isPrivate: true,
        roomCode,
        categories: topics,
        difficulty: normalizeDifficulty(difficulty),
        status: 'WAITING',
      },
      include: PLAYER_NAMES,
    });

    return res.json({ success: true, matchId: match.id, roomCode, match: serializeMatch(match) });
  } catch (e) {
    return sendMatchError(res, e, 'createFriendMatch');
  }
};

export const joinFriendMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomCode } = req.body || {};
    if (!roomCode) return res.status(400).json({ error: 'roomCode is required' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await prisma.match.findUnique({ where: { roomCode } });
    if (!match || !match.isPrivate) return res.status(404).json({ error: 'Match not found' });
    if (match.user1Id === userId) return res.status(400).json({ error: 'Cannot join your own match' });

    // Claim the open seat atomically: if two people join at once, only one gets it
    const { count } = await prisma.match.updateMany({
      where: { id: match.id, status: 'WAITING', user2Id: null },
      data: { user2Id: userId },
    });
    if (count === 0) return res.status(400).json({ error: 'Room already full' });

    const questionIds = await pickQuestions(match.categories, match.difficulty);
    const updated = await prisma.match.update({
      where: { id: match.id },
      data: { status: 'ONGOING', questions: { connect: questionIds.map((id) => ({ id })) } },
      include: PLAYER_NAMES,
    });
    await registerNewMatch(updated.id);

    getIO()?.to(updated.user1Id).emit('match:started', { matchId: updated.id });

    return res.json({ success: true, match: serializeMatch(updated) });
  } catch (e) {
    return sendMatchError(res, e, 'joinFriendMatch');
  }
};

export async function joinRandomMatch(req, res) {
  try {
    const userId = req.user.id;
    const { topics = [], difficulty } = req.body || {};
    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'topics[] is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const player = {
      userId,
      username: user.username,
      topics,
      difficulty: normalizeDifficulty(difficulty),
      xp: user.xp,
    };

    await takeFoundMatch(userId); // drop a stale result from a previous search
    const opponent = await pairOrEnqueue(player);
    if (!opponent) return res.json({ success: true, status: 'waiting' });

    // Questions reflect both players' preferences where they overlap
    const shared = topics.filter((t) => opponent.topics.includes(t));
    const categories = shared.length ? shared : topics;
    const questionIds = await pickQuestions(categories, player.difficulty);

    const match = await prisma.match.create({
      data: {
        user1Id: opponent.userId,
        user2Id: player.userId,
        isPrivate: false,
        categories,
        difficulty: player.difficulty,
        status: 'ONGOING',
        questions: { connect: questionIds.map((id) => ({ id })) },
      },
      include: PLAYER_NAMES,
    });
    await registerNewMatch(match.id);

    // The waiting player is told via socket, with a polling fallback (see getRandomMatchStatus)
    await recordFoundMatch(opponent.userId, match.id);
    getIO()?.to(opponent.userId).emit('match:found', { matchId: match.id, opponent: player });

    return res.json({ success: true, status: 'matched', matchId: match.id, match: serializeMatch(match) });
  } catch (error) {
    return sendMatchError(res, error, 'joinRandomMatch');
  }
}

export async function getRandomMatchStatus(req, res) {
  try {
    const matchId = await takeFoundMatch(req.user.id);
    return res.json({ success: true, status: matchId ? 'matched' : 'waiting', matchId });
  } catch (e) {
    return sendMatchError(res, e, 'getRandomMatchStatus');
  }
}

export async function leaveRandomQueue(req, res) {
  try {
    await leaveQueue(req.user.id);
    return res.json({ success: true });
  } catch (e) {
    return sendMatchError(res, e, 'leaveRandomQueue');
  }
}

export const getMatchStatus = async (req, res) => {
  try {
    const match = await prisma.match.findUnique({ where: { id: req.params.id }, include: PLAYER_NAMES });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    return res.json({
      success: true,
      status: match.status,
      isReady: match.status === 'ONGOING',
      match: serializeMatch(match),
    });
  } catch (e) {
    return sendMatchError(res, e, 'getMatchStatus');
  }
};

export const getMatchUsernames = async (req, res) => {
  try {
    const match = await prisma.match.findUnique({ where: { id: req.params.id }, include: PLAYER_NAMES });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    const { user1Username, user2Username } = serializeMatch(match);
    return res.json({
      success: true,
      matchId: match.id,
      user1Id: match.user1Id,
      user2Id: match.user2Id,
      user1Username,
      user2Username,
    });
  } catch (e) {
    return sendMatchError(res, e, 'getMatchUsernames');
  }
};

export const getMatchQuestions = async (req, res) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id },
      include: {
        ...PLAYER_NAMES,
        // Answers stay server-side until the result screen
        questions: {
          ...ORDERED_QUESTIONS,
          select: { id: true, text: true, options: true, categories: true, difficulty: true, type: true },
        },
      },
    });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    const { user1Username, user2Username } = serializeMatch(match);
    return res.json({
      success: true,
      questions: match.questions,
      currentIndex: match.currentIndex,
      user1Username,
      user2Username,
    });
  } catch (e) {
    return sendMatchError(res, e, 'getMatchQuestions');
  }
};

export const submitMatchAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body || {};
    if (!questionId || typeof answer !== 'string') {
      return res.status(400).json({ error: 'questionId and answer are required' });
    }
    const result = await submitAnswer(req.params.id, req.user.id, questionId, answer);
    return res.json({ success: true, ...result });
  } catch (e) {
    return sendMatchError(res, e, 'submitMatchAnswer');
  }
};

export const getMatchState = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: { _count: { select: { questions: true } } },
    });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    return res.json({
      success: true,
      status: match.status,
      currentIndex: match.currentIndex,
      total: match._count.questions,
      user1Id: match.user1Id,
      user2Id: match.user2Id,
      user1Score: match.user1Score,
      user2Score: match.user2Score,
      winnerId: match.winnerId,
      clock: match.status === 'ONGOING' ? await getLiveClock(id) : null,
    });
  } catch (e) {
    return sendMatchError(res, e, 'getMatchState');
  }
};

export const getMatchResult = async (req, res) => {
  try {
    const { id: matchId } = req.params;
    const userId = req.user.id;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } },
        questions: ORDERED_QUESTIONS,
        answers: { select: { questionId: true, userId: true, answer: true, correct: true } },
      },
    });

    if (!match) return res.status(404).json({ error: 'Match not found' });
    if (match.status !== 'COMPLETED') return res.status(400).json({ error: 'Match not completed yet' });

    // winnerId is authoritative (forfeits can win without a higher score); null means tie/abandoned
    const winner = match.winnerId === match.user1Id ? match.user1
      : match.winnerId === match.user2Id ? match.user2
      : null;

    const isUser1 = userId === match.user1Id;
    const userScore = isUser1 ? match.user1Score : match.user2Score;
    const opponentScore = isUser1 ? match.user2Score : match.user1Score;
    const xpEarned = computeMatchXP(userScore, winner?.id === userId);

    const questionResults = match.questions.map((question) => {
      const userAnswer = match.answers.find((a) => a.questionId === question.id && a.userId === userId);
      const opponentAnswer = match.answers.find((a) => a.questionId === question.id && a.userId !== userId);
      return {
        id: question.id,
        text: question.text,
        options: question.options,
        correctAnswer: question.answer,
        userAnswer: userAnswer?.answer || null,
        userCorrect: userAnswer?.correct || false,
        opponentAnswer: opponentAnswer?.answer || null,
        opponentCorrect: opponentAnswer?.correct || false,
      };
    });

    res.json({
      success: true,
      match: {
        id: match.id,
        categories: match.categories,
        difficulty: match.difficulty,
        totalQuestions: match.questions.length,
      },
      winner,
      userScore,
      opponentScore,
      xpEarned,
      questionResults,
      user1: match.user1,
      user2: match.user2,
    });
  } catch (error) {
    return sendMatchError(res, error, 'getMatchResult');
  }
};
