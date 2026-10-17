import redis from '../lib/redisClient.js';

// Redis-based fixed-window rate limiter for socket events
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
