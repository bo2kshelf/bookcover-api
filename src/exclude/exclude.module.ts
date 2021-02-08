import {HttpModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {RedisCacheModule} from '../redis-cache/redis-cache.module';
import {ExcludeConfig} from './exclude.config';
import {ExcludeService} from './exclude.service';

@Module({
  imports: [
    ConfigModule.forFeature(ExcludeConfig),
    HttpModule,
    RedisCacheModule,
  ],
  providers: [ExcludeService],
  exports: [ExcludeService],
})
export class ExcludeModule {}
