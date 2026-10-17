import express from 'express';
import { toggleSaveQuestion, checkMultipleSaved, getSavedQuestions } from '../controllers/savedQuestions.controller.js';
import { authenticateUser, requireSelf } from '../middlewares/auth.js';
import { validate, schemas } from '../middlewares/validate.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/toggle', validate({ body: schemas.toggleSave }), toggleSaveQuestion);
router.post('/check/:userId', requireSelf('userId'), validate({ body: schemas.checkSaved }), checkMultipleSaved);
router.get('/:userId', requireSelf('userId'), getSavedQuestions);

export default router;
