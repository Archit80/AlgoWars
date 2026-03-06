import express from 'express';
import cors from 'cors';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import questionsRoutes from './routes/questions.routes.js';
import userRoutes from './routes/user.routes.js';
import matchRoutes from './routes/match.routes.js';
import savedQuestionsRoutes from './routes/savedQuestions.routes.js';

const app = express();

// Security middleware (temporarily disabled for testing)
// app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://algo-wars.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Performance optimizations
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add response caching headers for static-ish data
app.use((req, res, next) => {
  // Cache GET requests for leaderboard and questions for 5 minutes
  if (req.method === 'GET' && (req.path.includes('/leaderboard') || req.path.includes('/questions'))) {
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
    const { PrismaClient } = await import('@prisma/client');
    const { default: pg } = await import('pg');
    const { PrismaPg } = await import('@prisma/adapter-pg');
    
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    
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

// Error handling middleware (temporarily disabled)
// app.use(errorHandler);

export default app;