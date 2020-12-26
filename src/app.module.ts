import {Module} from '@nestjs/common';
import {GraphQLFederationModule} from '@nestjs/graphql';
import {BooksModule} from './books/books.module';

@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      typePaths: ['**/schema.graphqls'],
    }),
    BooksModule,
  ],
})
export class AppModule {}
