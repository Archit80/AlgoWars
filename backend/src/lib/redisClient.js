import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL ,
});

redis.on("error", (err) => console.error("❌ Redis Error:", err));

(async () => {
  try {
    await redis.connect();
    console.log("✅ Redis connected");
    await redis.set('foo','bar');
    console.log("✅ Redis test write successful");
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
  }
})();

export default redis;
