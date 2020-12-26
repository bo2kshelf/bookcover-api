import {Module} from '@nestjs/common';
import {GraphQLFederationModule} from '@nestjs/graphql';
import {BooksModule} from './books/books.module';
import {Book} from './books/entity/book.entity';

@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      autoSchemaFile: true,
      buildSchemaOptions: {
        orphanedTypes: [Book],
      },
    }),
    BooksModule,
  ],
})
export class AppModule {}
