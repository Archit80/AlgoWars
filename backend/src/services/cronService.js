import cron from 'node-cron';
import fetch from 'node-fetch'; // assuming fetch is accessible or use global fetch in Node 18+

export function initCronJobs() {
  // Only run in production to avoid local spam
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Cron] Development mode detected. Cron jobs disabled.');
    return;
  }

  console.log('[Cron] Initializing production wake jobs...');

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  // Helper for fetch with retry
  const fetchWithRetry = async (url, options = {}, retries = 1) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      if (retries > 0) {
        console.warn(`[Cron] Request to ${url} failed. Retrying in 5s... (${retries} left)`);
        await new Promise(res => setTimeout(res, 5000));
        return fetchWithRetry(url, options, retries - 1);
      } else {
        console.error(`[Cron] Final failure for ${url}:`, error.message);
        return false;
      }
    }
  };

  // 1. Supabase Wake Job: Every 12 hours
  cron.schedule('0 */12 * * *', async () => {
    console.log('[Cron] Running Supabase Wake Job...');
    const success = await fetchWithRetry(`${backendUrl}/api/ping-supabase`);
    if (success) {
      console.log('[Cron] Supabase Wake Job successful.');
    }
  });

  // 2. Backend Wake Job: Every 20 minutes
  cron.schedule('*/20 * * * *', async () => {
    console.log('[Cron] Running Backend Wake Job...');
    const success = await fetchWithRetry(`${backendUrl}/health`);
    if (success) {
      console.log('[Cron] Backend Wake Job successful.');
    }
  });

  console.log('[Cron] Wake jobs scheduled successfully.');
}
