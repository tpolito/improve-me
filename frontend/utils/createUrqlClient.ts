import { dedupExchange, fetchExchange, ssrExchange } from 'urql';
import { cacheExchange, query } from '@urql/exchange-graphcache';
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  GetGoalsDocument,
  DeleteGoalMutationVariables,
} from '../generated/graphql';
import { customUpdateQuery } from './customUpdateQuery';

// Graphql Client
// TODO: Figure out how to handling caching of goals
// REVIEW: Go back and review how I set this up, still a little iffy on it.
export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          // TODO: This is where I would put the logic for handling GOALS cache
        },
      },
      updates: {
        Mutation: {
          // Login/Logout Updates
          // logout: (_result, args, cache, info) => {
          //   customUpdateQuery<LogoutMutation, MeQuery>(
          //     cache,
          //     { query: MeDocument },
          //     _result,
          //     () => ({ me: null })
          //   );
          // },
          logout: (result: any, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data): any => {
              return { me: null };
            });
          },
          // login: (_result, args, cache, info) => {
          //   customUpdateQuery<LoginMutation, MeQuery>(
          //     cache,
          //     { query: MeDocument },
          //     _result,
          //     (result, query) => {
          //       if (result.login.errors) {
          //         return query;
          //       } else {
          //         return {
          //           me: result.login.user,
          //         };
          //       }
          //     }
          //   );
          // },
          // FIXME: result and data are cast as "any". Want to fix this, and figure out the correct types.
          login: (result: any, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data): any => {
              if (result.login.errors) {
                return data;
              } else {
                return { me: result.login.user };
              }
            });

            cache.updateQuery({ query: GetGoalsDocument }, (data): any => {
              return { getGoals: [] };
            });
          },
          createUser: (_result, args, cache, info) => {
            customUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.createUser.errors) {
                  return query;
                } else {
                  return {
                    me: result.createUser.user,
                  };
                }
              }
            );
          },
          deleteGoal: (result: any, args, cache, info) => {
            cache.invalidate({
              __typename: 'Goal',
              id: (args as DeleteGoalMutationVariables).id,
            });
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
