import * as dotenv from 'dotenv';
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Field,
  ObjectType,
  Ctx,
} from 'type-graphql';
import argon2 from 'argon2';
import { User, UserModel } from '../types/User';
import { UserRegisterInput } from './InputTypes/UserRegisterInput';
import { UserLoginInput } from './InputTypes/UserLoginInput';
import { FieldError } from './ObjectTypes/FieldError';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { verifyRegister } from '../utils/verifyRegister';
import { v4 } from 'uuid';
import { FORGOT_PASSWORD_PREFIX } from '../constants';
import { sendEmail } from '../utils/sendEmail';

dotenv.config();

// User
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // QUERIES
  @Query(() => [User], { nullable: true })
  async users(): Promise<User[]> {
    const users: User[] = await UserModel.find();

    return users;
  }

  @Query(() => User, { nullable: true })
  async user(@Arg('id') id: string): Promise<User | null> {
    const user: User | null = await UserModel.findById(id);

    return user;
  }

  // ME Query
  @Query(() => User, { nullable: true })
  async me(@Ctx() req: ContextParameters) {
    // Not logged in
    if (!req.request.session?.userId) {
      return null;
    }

    const user = await UserModel.findOne({ _id: req.request.session?.userId });

    return user;
  }

  // MUTATIONS
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() req: any
  ): Promise<UserResponse> {
    if (newPassword.length <= 5) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'length must be greater than 5',
          },
        ],
      };
    }

    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await req.redisClient.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'invalid token',
          },
        ],
      };
    }

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user does not exist',
          },
        ],
      };
    }

    user.password = await argon2.hash(newPassword);
    user.updatedAt = new Date();
    user.save();

    await req.redisClient.del(key);

    // Login the user
    req.request.session!.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string, @Ctx() req: any) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      // Email doesn't exist in the DB, but we are not telling the end user that
      return true;
    }

    const token = v4();

    await req.redisClient.set(
      FORGOT_PASSWORD_PREFIX + token,
      user._id,
      'ex',
      1000 * 60 * 60 * 24 * 2 // 2 days
    );

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
    );

    // Found user and sent email sucessfully
    return true;
  }

  @Mutation(() => UserResponse)
  // Register
  async createUser(
    @Arg('options') options: UserRegisterInput,
    @Ctx() req: ContextParameters
  ): Promise<UserResponse> {
    // Destructure User Info
    const { username, email, password } = options;

    const errors = verifyRegister(options);

    if (errors) {
      return { errors };
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);
    // Create User
    const user = new UserModel({ username, email, password: hashedPassword });

    // Save User to the database -
    try {
      await user.save();
    } catch (err) {
      if (err.keyValue.hasOwnProperty('username')) {
        return {
          errors: [
            {
              field: 'username',
              message: 'username taken',
            },
          ],
        };
      } else if (err.keyValue.hasOwnProperty('email')) {
        return {
          errors: [
            {
              field: 'email',
              message: 'email is taken',
            },
          ],
        };
      } else {
        return {
          errors: [
            {
              field: 'user',
              message:
                'registration could not be completed, please try again later',
            },
          ],
        };
      }
    }

    // Login User
    req.request.session!.userId = user._id;

    // Return the User
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UserLoginInput,
    @Ctx() req: ContextParameters
  ): Promise<UserResponse> {
    // Destructure User Info
    const { username, password } = options;

    const user = await UserModel.findOne({ username }); // findOne(username: username)

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'That username does not exist',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Password is incorrect',
          },
        ],
      };
    }

    // the "!" is saying that I am 100% sure that if I get here I will ALWAYS have a session with a userId to set
    req.request.session!.userId = user._id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() req: ContextParameters) {
    return new Promise((resolve) =>
      req.request.session!.destroy((err) => {
        req.request.res!.clearCookie(process.env.COOKIE_NAME as string);

        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteUser(@Arg('id') id: string) {
    await UserModel.deleteOne({ _id: id });

    return true;
  }
}
