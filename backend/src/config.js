// Origins allowed for both HTTP (CORS) and Socket.IO.
// FRONTEND_URL and FRONTEND_ORIGIN were historically read by different layers; both still work.
export const allowedOrigins = [
  'http://localhost:3000',
  'https://algo-wars.vercel.app',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_ORIGIN,
].filter(Boolean);
