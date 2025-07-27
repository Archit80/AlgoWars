// const app = require('./app');
import app from './app.js';
import {createServer} from 'http';

const httpServer = createServer(app);

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
