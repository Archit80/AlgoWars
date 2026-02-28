import app from './app.js';
import { createServer } from 'http';
import { initIO } from './sockets/io.js';
import { connectRedis } from './lib/redisClient.js';
import { initCronJobs } from './services/cronService.js';

const httpServer = createServer(app);

const PORT = process.env.PORT || 8000;

// Initialize Redis, Socket.IO, then start server
async function start() {
  // Connect Redis first
  await connectRedis();

  // Initialize Socket.IO (CORS: allow frontend origin if provided)
  const allowedOrigins = [
    'http://localhost:3000',
    'https://algo-wars.vercel.app',
    process.env.FRONTEND_ORIGIN
  ].filter(Boolean);
  initIO(httpServer, allowedOrigins);

  // Initialize Wake Tasks (cron jobs)
  initCronJobs();

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
