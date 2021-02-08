import {Module} from '@nestjs/common';
import {ExcludeModule} from '../exclude/exclude.module';
import {OpenBDModule} from '../openbd/openbd.module';
import {RakutenModule} from '../rakuten/rakuten.module';
import {RedisCacheModule} from '../redis-cache/redis-cache.module';
import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';

@Module({
  imports: [ExcludeModule, RedisCacheModule, OpenBDModule, RakutenModule],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}
