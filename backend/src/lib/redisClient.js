import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.error("❌ Redis Error:", err));

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
