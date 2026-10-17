import express from 'express';
import { getUserById, getUserStats, getUserAchievements, getUserLevelInfo, updateUserOnboarding, getUserByUsername, getUserStatsByUsername } from '../controllers/user.controller.js';
import { authenticateUser, requireSelf } from '../middlewares/auth.js';
import { validate, schemas } from '../middlewares/validate.js';

const router = express.Router();

// Profile reads are public; writes require the owner.
router.get(`/:id`, getUserById);
router.get(`/:id/stats`, getUserStats);
router.patch(`/:id/onboarding`, authenticateUser, requireSelf('id'), validate({ body: schemas.onboarding }), updateUserOnboarding);
router.get(`/:id/achievements`, getUserAchievements);
router.get(`/:id/level`, getUserLevelInfo);

// Username-based routes
router.get(`/username/:username`, getUserByUsername);
router.get(`/username/:username/stats`, getUserStatsByUsername);

export default router;
