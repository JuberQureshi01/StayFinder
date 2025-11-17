import Redis from "ioredis";

let redisClient;

const connectRedis = () => {
    try {
        redisClient = new Redis(process.env.REDIS_URI);
        redisClient.on("connect", () => {
            console.log("redis is successfully connected");
        });
        redisClient.on("error", (err) => {
            console.error("Some Error Occured at redis", err);
        });
    } catch (error) {
        console.error(500, "redis server error");
    }
};

export { connectRedis, redisClient };
