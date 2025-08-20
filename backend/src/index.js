// const app = require('./app');
import app from './app.js';
import {createServer} from 'http';
import { initIO } from './sockets/io.js';

const httpServer = createServer(app);

const PORT = process.env.PORT || 8000;

// Initialize Socket.IO (CORS: allow frontend origin if provided)
initIO(httpServer, process.env.FRONTEND_ORIGIN || '*');

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
