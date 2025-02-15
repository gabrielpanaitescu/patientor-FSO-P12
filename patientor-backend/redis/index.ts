import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "../src/utils/config";

let redisClient: RedisClientType;
let isReady: boolean = false;

const getRedisClient = async (): Promise<RedisClientType> => {
  if (!isReady) {
    redisClient = createClient({
      url: REDIS_URL,
    });

    redisClient.on("error", (error) => console.log("Redis error", error));
    redisClient.on("connect", () => console.log("Redis connected"));
    redisClient.on("reconnecting", () => console.log("Redis reconnecting"));
    redisClient.on("ready", () => {
      isReady = true;
      console.log("Redis ready!");
    });

    await redisClient.connect();
  }

  return redisClient;
};

getRedisClient()
  .then((connection) => {
    redisClient = connection;
  })
  .catch((error) => {
    console.log("Failed to connect to Redis", error);
  });

export default getRedisClient;
