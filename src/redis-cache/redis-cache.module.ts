import {CacheModule, Module} from '@nestjs/common';
import {ConfigModule, ConfigType} from '@nestjs/config';
import {RedisCacheConfig} from './redis-cache.config';
import {RedisCacheService} from './redis-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule.forFeature(RedisCacheConfig)],
      inject: [RedisCacheConfig.KEY],
      useFactory: async (config: ConfigType<typeof RedisCacheConfig>) => ({
        store: require('cache-manager-redis-store'),
        host: config.host,
        port: config.port,
        ttl: config.ttl,
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
