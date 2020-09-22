import { ObjectType, Field, ID } from 'type-graphql';
import { getModelForClass, Prop } from '@typegoose/typegoose';

@ObjectType({ description: 'Step Model' })
export class Step {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop({ default: false })
  completed: boolean;

  @Field()
  @Prop({ default: new Date() })
  createdAt: string;

  @Field()
  @Prop({ default: new Date() })
  updatedAt: string;
}

export const StepModel = getModelForClass(Step);
