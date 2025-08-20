// src/lib/redisClient.js
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => console.error("❌ Redis Error:", err));

(async () => {
  try {
    await redis.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
  }
})();

export default redis;
