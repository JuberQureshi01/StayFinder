import Redis from 'ioredis';

let redisClient;

const connectRedis = () => {
    try {
        redisClient = new Redis(process.env.REDIS_URI);

        redisClient.on('connect', () => {
            console.log(' Redis client connected successfully.');
        });
        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
            
        
        });

    } catch (error) {
        console.error(500, "Could not create Redis client.", error);
    }
};

export { connectRedis, redisClient };