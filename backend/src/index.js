import 'dotenv/config'; // first: later modules read env vars at import time
import app from './app.js';
import { createServer } from 'http';
import { initIO } from './sockets/io.js';
import { connectRedis } from './lib/redisClient.js';
import { initMatchEngine } from './services/matchEngine.js';
import { allowedOrigins } from './config.js';

const httpServer = createServer(app);

const PORT = process.env.PORT || 8000;

// Initialize Redis, Socket.IO, then start server
async function start() {
  // Connect Redis first
  await connectRedis();

  const io = initIO(httpServer, allowedOrigins);
  initMatchEngine(io);

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
