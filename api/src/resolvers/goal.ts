import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Field,
  ObjectType,
  Ctx,
  InputType,
} from 'type-graphql';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { Error } from './ObjectTypes/Error';
import { GoalInput } from './InputTypes/GoalInput';
import { Goal, GoalModel } from '../types/Goals';
import { StepModel } from '../types/Step';

@ObjectType()
class GoalResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field(() => Goal, { nullable: true })
  goal?: Goal;
}

@ObjectType()
class DeleteGoalResponse {
  @Field()
  deleted: Boolean;

  @Field()
  id: String;
}

@InputType()
class ToggleStepInput {
  @Field()
  goalId: String;

  @Field()
  stepId: String;
}

@Resolver()
export class GoalResolver {
  // QUERIES
  @Query(() => [Goal], { nullable: true })
  async getGoals(@Ctx() req: ContextParameters): Promise<Goal[]> {
    // Find all goals from the logged in user
    const goals = await GoalModel.find({
      user_id: req.request.session?.userId,
    });

    // Return Goals
    return goals;
  }

  // MUTATIONS
  @Mutation(() => GoalResponse)
  async addGoal(
    @Arg('options') options: GoalInput,
    @Ctx() req: ContextParameters
  ): Promise<GoalResponse> {
    // Deconstruction
    const { title, desc, steps } = options;
    // Get User ID
    const user_id = req.request.session!.userId;

    // Validation
    if (!user_id) {
      return {
        errors: [
          {
            message: 'You must be logged in to create a goal',
          },
        ],
      };
    }

    if (title.length <= 3) {
      return {
        errors: [
          {
            message: 'Title must be at least 3 characters long',
          },
        ],
      };
    }

    if (!desc) {
      return {
        errors: [
          {
            message: 'Must have a description',
          },
        ],
      };
    }

    const stepArr = steps.map((step) => {
      return new StepModel({ name: step });
    });

    // Create Goal -> Save to DB -> Return the goal
    const goal = new GoalModel({
      title,
      desc,
      user_id,
      steps: stepArr,
    });

    await goal.save();

    return { goal };
  }

  @Mutation(() => DeleteGoalResponse, { nullable: true })
  async deleteGoal(@Arg('id') id: string): Promise<DeleteGoalResponse> {
    await GoalModel.deleteOne({ _id: id });

    return { deleted: true, id };
  }

  @Mutation(() => Boolean)
  async toggleStep(@Arg('options') options: ToggleStepInput): Promise<Boolean> {
    // Find the goal
    const goal = await GoalModel.findById(options.goalId);

    // Get the step of the goal
    // HACK: .id method is not supported - https://mongoosejs.com/docs/subdocs.html#finding-a-subdocument
    // @ts-ignore
    const step = await goal?.steps.id(options.stepId);

    // Toggle completion of the goal
    step.completed = !step.completed;
    // Updated the updatedAt field
    step.updatedAt = new Date();

    // TODO: Add error checking
    // Save the goal
    await goal?.save();

    return true;
  }
}
