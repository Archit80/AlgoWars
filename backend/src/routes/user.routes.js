import express from 'express';
import { getUserById, getUserStats, getUserAchievements, getUserLevelInfo, updateUserOnboarding, getUserByUsername, getUserStatsByUsername } from '../controllers/user.controller.js';

const router = express.Router();

router.get(`/:id`, getUserById);
router.get(`/:id/stats`, getUserStats);
router.patch(`/:id/onboarding`, updateUserOnboarding);
router.get(`/:id/achievements`, getUserAchievements);
router.get(`/:id/level`, getUserLevelInfo);

// Username-based routes
router.get(`/username/:username`, getUserByUsername);
router.get(`/username/:username/stats`, getUserStatsByUsername);

export default router;
