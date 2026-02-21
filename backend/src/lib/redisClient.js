import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.error("❌ Redis Error:", err));

let connectPromise = null;

export async function ensureRedisConnection() {
  if (redis.isOpen) return redis;
  if (!connectPromise) {
    connectPromise = redis.connect()
      .then(() => {
        console.log("✅ Redis connected");
        return redis;
      })
      .catch((err) => {
        connectPromise = null;
        throw err;
      });
  }

  return connectPromise;
}

(async () => {
  try {
    await ensureRedisConnection();
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
  }
})();

export default redis;
