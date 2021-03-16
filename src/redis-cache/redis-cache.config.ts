import {registerAs} from '@nestjs/config';

export const RedisCacheConfig = registerAs('redis-cache', () => ({
  host: process.env.REDIS_HOST!,
  port: Number.parseInt(process.env.REDIS_PORT!, 10),
  ttl: 60 * 60 * 24 * 7,
}));
