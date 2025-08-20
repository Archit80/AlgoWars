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
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Legacy test endpoint
app.get('/test', (req, res) => {
  res.send('AlgoWars backend running!');
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