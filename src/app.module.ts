import {Module} from '@nestjs/common';
import {GraphQLFederationModule} from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
})
export class AppModule {}
