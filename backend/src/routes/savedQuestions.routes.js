import express from 'express';
import { toggleSaveQuestion, checkMultipleSaved, getSavedQuestions } from '../controllers/savedQuestions.controller.js';

const router = express.Router();

router.post('/toggle', toggleSaveQuestion);
router.post('/check/:userId', checkMultipleSaved);
router.get('/:userId', getSavedQuestions);

export default router;
