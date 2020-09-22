import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Error {
  @Field()
  message: string;
}
