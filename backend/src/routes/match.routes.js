import { Router } from 'express';
import {
  createFriendMatch,
  joinFriendMatch,
  joinRandomMatch,
  getRandomMatchStatus,
  leaveRandomQueue,
  getMatchStatus,
  submitMatchAnswer,
  getMatchQuestions,
  getMatchState,
  getMatchResult,
  getMatchUsernames,
} from '../controllers/match.controller.js';
import { authenticateUser } from '../middlewares/auth.js';
import { validate, schemas } from '../middlewares/validate.js';

const router = Router();

router.use(authenticateUser);

router.post('/friend', validate({ body: schemas.createMatch }), createFriendMatch);
router.post('/join-by-code', validate({ body: schemas.joinByCode }), joinFriendMatch);

// Must precede the /:id routes, or "random" would be read as a match id
router.post('/random', validate({ body: schemas.createMatch }), joinRandomMatch);
router.get('/random/status', getRandomMatchStatus);
router.delete('/random', leaveRandomQueue);

router.get('/:id/status', getMatchStatus);
router.get('/:id/questions', getMatchQuestions);
router.get('/:id/usernames', getMatchUsernames);
router.post('/:id/answer', validate({ body: schemas.submitAnswer }), submitMatchAnswer);
router.get('/:id/state', getMatchState);
router.get('/:id/result', getMatchResult);

export default router;
