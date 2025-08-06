import express from 'express';
import cors from 'cors';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import questionsRoutes from './routes/questions.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/test', (req, res) => {
  res.send('CodeClash backend running!');
});

app.use('/api/leaderboard', leaderboardRoutes);

app.use ('/api/questions', questionsRoutes);

app.use('/api/user', userRoutes);

export default app;