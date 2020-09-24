import { ObjectType, Field, ID } from 'type-graphql';
import { getModelForClass, Prop } from '@typegoose/typegoose';

@ObjectType({ description: 'User Model' })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, lowercase: true, unique: true })
  username: string;

  @Field()
  @Prop({ required: true, lowercase: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Field()
  @Prop({ required: true, default: new Date() })
  updatedAt: Date;

  // Not exposed to Graphql api
  // JUST a database value
  @Prop({ required: true })
  password: string;
}

export const UserModel = getModelForClass(User);
