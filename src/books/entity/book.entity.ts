import {Directive, Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Book {
  @Field(() => ID)
  @Directive('@external')
  id!: string;

  @Field(() => String)
  @Directive('@external')
  title!: string;

  @Field(() => String, {nullable: true})
  @Directive('@external')
  isbn?: string;
}
