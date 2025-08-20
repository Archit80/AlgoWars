import { Router } from 'express';
import { createFriendMatch, joinFriendMatch, joinRandomMatch, getMatchStatus, submitMatchAnswer, getMatchQuestions, getMatchState, getMatchResult, getMatchUsernames } from '../controllers/match.controller.js';
import { authenticateUser } from '../middlewares/auth.js';
// import { generalRateLimit, matchActionLimit, answerSubmissionLimit } from '../middlewares/rateLimit.js';
// import { validateMatchCreation, validateAnswerSubmission, validateMatchId } from '../middlewares/validation.js';

const router = Router();


router.use(authenticateUser);

router.post('/friend', createFriendMatch);
router.post('/join-by-code', joinFriendMatch);
router.post('/random', joinRandomMatch);
router.get('/:id/status', getMatchStatus);
router.get('/:id/questions', getMatchQuestions);
router.get('/:id/usernames', getMatchUsernames);
router.post('/:id/answer', submitMatchAnswer);
router.get('/:id/state', getMatchState);
router.get('/:id/result', getMatchResult);

export default router;
