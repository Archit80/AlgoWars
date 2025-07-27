import express from 'express';
import cors from 'cors';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/test', (req, res) => {
  res.send('CodeClash backend running!');
});

app.use('/api/leaderboard', leaderboardRoutes);

export default app;