import { body, param, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

export const validateMatchCreation = [
  body('difficulty')
    .isIn(['EASY', 'MEDIUM', 'HARD'])
    .withMessage('Difficulty must be EASY, MEDIUM, or HARD'),
  body('categories')
    .isArray({ min: 1, max: 5 })
    .withMessage('Categories must be an array with 1-5 items')
    .custom((categories) => {
      const validCategories = ['ARRAYS', 'STRINGS', 'LINKED_LISTS', 'TREES', 'GRAPHS', 'DYNAMIC_PROGRAMMING', 'SORTING', 'SEARCHING'];
      return categories.every(cat => validCategories.includes(cat));
    })
    .withMessage('Invalid category provided'),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
  handleValidationErrors
];

export const validateAnswerSubmission = [
  param('id').isUUID().withMessage('Invalid match ID'),
  body('questionId').isUUID().withMessage('Invalid question ID'),
  body('answer').isString().trim().isLength({ min: 1, max: 500 })
    .withMessage('Answer must be a non-empty string (max 500 chars)'),
  handleValidationErrors
];

export const validateMatchId = [
  param('id').isUUID().withMessage('Invalid match ID'),
  handleValidationErrors
];

export const validateUserId = [
  param('userId').isUUID().withMessage('Invalid user ID'),
  handleValidationErrors
];
