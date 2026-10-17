import { z } from 'zod';

// Validates and replaces req.body / req.query with the parsed (coerced, stripped) value.
export function validate({ body, query }) {
  return (req, res, next) => {
    for (const [key, schema] of [['body', body], ['query', query]]) {
      if (!schema) continue;
      const result = schema.safeParse(req[key] ?? {});
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        });
      }
      // Express 5 exposes req.query as a getter, so redefine it rather than assigning
      Object.defineProperty(req, key, { value: result.data, writable: true, configurable: true });
    }
    next();
  };
}

const topics = z.array(z.string().trim().min(1).max(50)).min(1).max(10);
const difficulty = z.string().trim().max(10).optional();

export const schemas = {
  createMatch: z.object({ topics, difficulty }),
  joinByCode: z.object({ roomCode: z.string().trim().toUpperCase().min(4).max(12) }),
  submitAnswer: z.object({ questionId: z.string().min(1).max(100), answer: z.string().max(1000) }),

  soloQuery: z.object({
    categories: z.string().min(1).max(500),
    mode: z.enum(['timed', 'accuracy']),
    difficulty: z.enum(['easy', 'medium', 'hard', 'EASY', 'MEDIUM', 'HARD']),
    questionCount: z.coerce.number().int().min(1).max(50).default(10),
  }),
  endSolo: z.object({
    soloSessionId: z.coerce.number().int().positive(),
    answers: z.array(z.object({
      questionId: z.string().min(1).max(100),
      answer: z.string().max(1000),
    })).max(50).default([]),
  }),

  onboarding: z.object({
    // Same rule as the onboarding form
    username: z.string().trim().regex(/^[a-zA-Z0-9._-]{3,20}$/, 'Username must be 3-20 characters: letters, numbers, . _ -'),
    // Empty when no picture was uploaded
    profilePic: z.string().trim().max(500)
      .refine((v) => v === '' || v.startsWith('https://'), 'profilePic must be an https URL')
      .optional(),
  }),

  toggleSave: z.object({
    questionId: z.string().min(1).max(100),
    savedFrom: z.enum(['BATTLE_RESULT', 'SOLO_RESULT']).optional(),
    userAnswer: z.string().max(1000).nullish(),
    wasCorrect: z.boolean().optional(),
  }),
  checkSaved: z.object({ questionIds: z.array(z.string().min(1).max(100)).max(100) }),
};
