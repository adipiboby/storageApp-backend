import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  username: "default",
  password: "atHm7AP5fVfBxHuHhRpcK62YPWaakaKU",
  // password: "My$trong123Pass",//localhost
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
  process.exit(1);
});

await redisClient.connect();
console.log("redis connected");
export default redisClient;
