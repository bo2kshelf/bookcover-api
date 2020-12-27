import {Directive, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {BooksService} from './books.service';
import {Book} from './entity/book.entity';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private bookService: BooksService) {}

  @ResolveField(() => String, {nullable: true})
  @Directive(`@requires(fields: "isbn title")`)
  async cover(@Parent() book: {title: string; isbn?: string}) {
    return this.bookService.getCover(book);
  }
}
