import Redis from 'ioredis';
import env from './env.js';
import logger from '../utils/logger.util.js';

const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

export const redis = new Redis(env.REDIS_URL || redisConfig);

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

export default redis;

