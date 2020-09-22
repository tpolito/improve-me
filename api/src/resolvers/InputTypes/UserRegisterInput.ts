import { InputType, Field } from 'type-graphql';

@InputType()
export class UserRegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
