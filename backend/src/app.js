import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './utils/errorHandler.js';
import { allowedOrigins } from './config.js';
import prisma from './db/prismaClient.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import questionsRoutes from './routes/questions.routes.js';
import userRoutes from './routes/user.routes.js';
import matchRoutes from './routes/match.routes.js';
import savedQuestionsRoutes from './routes/savedQuestions.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// The API only takes small JSON bodies (largest: a solo session's answers)
app.use(express.json({ limit: '100kb' }));

// Add response caching headers for public, side-effect-free data
app.use((req, res, next) => {
  // Cache leaderboard for 5 minutes (not /questions: get-solo creates a session per call)
  if (req.method === 'GET' && req.path.includes('/leaderboard')) {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  // Cache user stats for 2 minutes
  if (req.method === 'GET' && req.path.includes('/user/') && req.path.includes('/stats')) {
    res.set('Cache-Control', 'public, max-age=120'); // 2 minutes
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Supabase Wake Endpoint
app.get('/api/ping-supabase', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1;`;
    res.json({ status: 'ok', message: 'Supabase pinged successfully' });
  } catch (error) {
    console.error('Failed to ping Supabase:', error);
    res.status(500).json({ status: 'error', message: 'Failed to ping Supabase' });
  }
});

// Routes
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/saved-questions', savedQuestionsRoutes);

app.use(errorHandler);

export default app;