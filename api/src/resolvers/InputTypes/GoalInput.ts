import { InputType, Field } from 'type-graphql';

@InputType()
export class GoalInput {
  @Field()
  title: string;

  @Field()
  desc: string;

  @Field(() => [String])
  steps: string[];
}
