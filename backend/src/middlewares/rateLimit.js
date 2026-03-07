import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import redis from '../lib/redisClient.js';

// General API rate limiter
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for match actions
export const matchActionLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 actions per minute
  message: { error: 'Too many match actions, slow down' },
  keyGenerator: (req) => `match_${req.user?.id || ipKeyGenerator(req)}`,
});

// Answer submission rate limit (prevent rapid fire)
export const answerSubmissionLimit = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 1, // 1 answer per 5 seconds
  message: { error: 'Please wait before submitting another answer' },
  keyGenerator: (req) => `answer_${req.user?.id || ipKeyGenerator(req)}_${req.params.id}`,
});

// Redis-based custom rate limiter for socket events
export async function socketRateLimit(socket, event, maxRequests = 10, windowMs = 60000) {
  const key = `socket_rate_${socket.userId}_${event}`;
  
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }
    
    if (current > maxRequests) {
      socket.emit('rate_limit_exceeded', { 
        event, 
        retryAfter: await redis.ttl(key) 
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Fail open
  }
}
