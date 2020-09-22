import { ObjectType, Field, ID } from 'type-graphql';
import { getModelForClass, Prop, Ref } from '@typegoose/typegoose';
import { User } from './User';
import { Step } from './Step';

@ObjectType({ description: 'Goal Model' })
export class Goal {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ ref: User, required: true })
  user_id: Ref<User>;

  @Field()
  @Prop()
  title: string;

  @Field()
  @Prop()
  desc: string;

  @Field(() => [Step])
  @Prop({ type: Step }) // , _id: false
  steps: Step[];

  @Field()
  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Field()
  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}

export const GoalModel = getModelForClass(Goal);
