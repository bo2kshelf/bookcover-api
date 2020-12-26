import {Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {BooksService} from './books.service';

@Resolver('Book')
export class BooksResolver {
  constructor(private bookService: BooksService) {}

  @ResolveField()
  async cover(@Parent() book: {isbn?: string}) {
    return this.bookService.getCover(book);
  }
}
