// const app = require('./app');
import app from './app.js';
import {createServer} from 'http';
import { initIO } from './sockets/io.js';

const httpServer = createServer(app);

const PORT = process.env.PORT || 8000;

// Initialize Socket.IO (CORS: allow frontend origin if provided)
const allowedOrigins = [
  'http://localhost:3000',
  'https://algo-wars.vercel.app',
  process.env.FRONTEND_ORIGIN
].filter(Boolean);
initIO(httpServer, allowedOrigins);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
