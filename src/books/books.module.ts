import {Module} from '@nestjs/common';
import {OpenBDModule} from '../openbd/openbd.module';
import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';

@Module({
  imports: [OpenBDModule],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}
