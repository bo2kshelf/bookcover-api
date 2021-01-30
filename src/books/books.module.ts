import {Module} from '@nestjs/common';
import {OpenBDModule} from '../openbd/openbd.module';
import {RakutenModule} from '../rakuten/rakuten.module';
import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';

@Module({
  imports: [OpenBDModule, RakutenModule],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}
