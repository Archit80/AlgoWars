/**
 * Level System Utilities
 * Exponential progression with milestone bonuses
 * Growth rate: 1.25 (25% increase per level)
 */

/**
 * Calculate XP required for a specific level
 * @param {number} level - Target level (1-based)
 * @returns {number} XP required for that level
 */
export const getXPForLevel = (level) => {
  const base = 100;
  const growthRate = 1.2; // 20% increase per level

  // Milestone bonuses every 10 levels
  const milestoneBonus = Math.floor((level - 1) / 10) * 500;
  
  return Math.floor(base * Math.pow(growthRate, level - 1) + milestoneBonus);
};

/**
 * Calculate total XP required to reach a specific level
 * @param {number} targetLevel - Target level (1-based)
 * @returns {number} Total XP needed to reach that level
 */
export const getTotalXPForLevel = (targetLevel) => {
  let total = 0;
  for (let i = 1; i < targetLevel; i++) {
    total += getXPForLevel(i);
  }
  return total;
};

/**
 * Calculate current level and progress from total XP
 * @param {number} totalXP - User's total XP
 * @returns {Object} Level info: { level, currentLevelXP, xpToNext, totalXPForNextLevel, progress }
 */
export const getLevelFromXP = (totalXP) => {
  let level = 1;
  let accumulatedXP = 0;
  
  // Find current level by accumulating XP requirements
  while (true) {
    const xpForNextLevel = getXPForLevel(level);
    if (accumulatedXP + xpForNextLevel > totalXP) {
      break;
    }
    accumulatedXP += xpForNextLevel;
    level++;
  }
  
  // Calculate progress within current level
  const currentLevelXP = totalXP - accumulatedXP;
  const xpRequiredForCurrentLevel = getXPForLevel(level);
  const xpToNext = xpRequiredForCurrentLevel - currentLevelXP;
  const totalXPForNextLevel = totalXP + xpToNext;
  const progress = Math.round((currentLevelXP / xpRequiredForCurrentLevel) * 100);
  
  return {
    level,
    currentLevelXP,
    xpToNext,
    totalXPForNextLevel,
    xpRequiredForCurrentLevel,
    progress, // Percentage progress (0-100)
    totalXPAtLevelStart: accumulatedXP
  };
};

/**
 * Get level tier information
 * @param {number} level - User's level
 * @returns {Object} Tier info: { tier, tierName, color }
 */
export const getLevelTier = (level) => {
  if (level >= 40) return { tier: 6, tierName: 'LEGEND', color: '#FFD700', emoji: '👑' };
  if (level >= 25) return { tier: 5, tierName: 'MASTER', color: '#E74C3C', emoji: '🔥' };
  if (level >= 15) return { tier: 4, tierName: 'EXPERT', color: '#9B59B6', emoji: '💜' };
  if (level >= 7) return { tier: 3, tierName: 'ADVANCED', color: '#3498DB', emoji: '💎' };
  if (level >= 3) return { tier: 2, tierName: 'INTERMEDIATE', color: '#2ECC71', emoji: '⚡' };
  return { tier: 1, tierName: 'BEGINNER', color: '#95A5A6', emoji: '🌱' };
};

/**
 * Check if level is a milestone (every 10 levels)
 * @param {number} level - Level to check
 * @returns {boolean} True if milestone level
 */
export const isMilestoneLevel = (level) => {
  return level > 1 && level % 10 === 1;
};

/**
 * Get estimated time to reach next level
 * @param {number} xpToNext - XP needed for next level
 * @param {number} dailyXPAverage - Average XP per day (default: 50)
 * @returns {Object} Time estimate: { days, weeks, months }
 */
export const getTimeToNextLevel = (xpToNext, dailyXPAverage = 50) => {
  const days = Math.ceil(xpToNext / dailyXPAverage);
  const weeks = Math.ceil(days / 7);
  const months = Math.ceil(days / 30);
  
  return { days, weeks, months };
};

/**
 * Legacy compatibility - old linear system calculation
 * @deprecated Use getLevelFromXP instead
 * @param {number} xp - User's XP
 * @returns {Object} Level info using old system
 */
export const getLevelFromXPLegacy = (xp) => {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXP = xp % 100;
  const xpToNext = 100 - currentLevelXP;
  const totalXPForNextLevel = xp + xpToNext;
  
  return {
    level,
    currentLevelXP,
    xpToNext,
    totalXPForNextLevel,
    progress: currentLevelXP
  };
};
