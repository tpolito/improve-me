import { Resolver, Query, Ctx } from 'type-graphql';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(@Ctx() req: any) {
    console.log(req.request.session);

    return 'hello world';
  }
}
