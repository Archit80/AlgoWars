import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
  // Upstash drops idle TLS connections; a periodic PING keeps this one in use
  pingInterval: 60_000,
  socket: {
    connectTimeout: 10_000,
    // Exponential backoff with jitter, capped at 5s. Commands issued while reconnecting are
    // queued and sent once the connection is back.
    reconnectStrategy: (retries) => Math.min(2 ** retries * 100, 5_000) + Math.floor(Math.random() * 200),
  },
});

// Connection blips are expected and self-heal; keep the log to one line per event
redis.on("error", (err) => console.error(`❌ Redis error: ${err.code ?? err.name}: ${err.message}`));
redis.on("reconnecting", () => console.warn("⚠️ Redis reconnecting..."));
redis.on("ready", () => console.log("✅ Redis ready"));

// Single controlled connection function — called from server entry point
export async function connectRedis() {
  try {
    await redis.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
    throw err;
  }
}

export default redis;
