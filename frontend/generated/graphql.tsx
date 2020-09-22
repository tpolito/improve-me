import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  users?: Maybe<Array<User>>;
  user?: Maybe<User>;
  me?: Maybe<User>;
  getGoals?: Maybe<Array<Goal>>;
  hello: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['String'];
};

/** User Model */
export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
};

/** Goal Model */
export type Goal = {
  __typename?: 'Goal';
  _id: Scalars['ID'];
  user_id: Scalars['String'];
  title: Scalars['String'];
  desc: Scalars['String'];
  steps: Array<Step>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

/** Step Model */
export type Step = {
  __typename?: 'Step';
  _id: Scalars['ID'];
  name: Scalars['String'];
  completed: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};


export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  createUser: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  deleteUser?: Maybe<Scalars['Boolean']>;
  addGoal: GoalResponse;
  deleteGoal?: Maybe<DeleteGoalResponse>;
  toggleStep: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationCreateUserArgs = {
  options: UserRegisterInput;
};


export type MutationLoginArgs = {
  options: UserLoginInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationAddGoalArgs = {
  options: GoalInput;
};


export type MutationDeleteGoalArgs = {
  id: Scalars['String'];
};


export type MutationToggleStepArgs = {
  options: ToggleStepInput;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserRegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserLoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type GoalResponse = {
  __typename?: 'GoalResponse';
  errors?: Maybe<Array<Error>>;
  goal?: Maybe<Goal>;
};

export type Error = {
  __typename?: 'Error';
  message: Scalars['String'];
};

export type GoalInput = {
  title: Scalars['String'];
  desc: Scalars['String'];
  steps: Array<Scalars['String']>;
};

export type DeleteGoalResponse = {
  __typename?: 'DeleteGoalResponse';
  deleted: Scalars['Boolean'];
  id: Scalars['String'];
};

export type ToggleStepInput = {
  goalId: Scalars['String'];
  stepId: Scalars['String'];
};

export type DefaultGoalFragment = (
  { __typename?: 'Goal' }
  & Pick<Goal, '_id' | 'user_id' | 'title' | 'desc' | 'createdAt' | 'updatedAt'>
  & { steps: Array<(
    { __typename?: 'Step' }
    & Pick<Step, 'name' | '_id' | 'completed' | 'createdAt' | 'updatedAt'>
  )> }
);

export type DefaultGoalErrorFragment = (
  { __typename?: 'Error' }
  & Pick<Error, 'message'>
);

export type DefaultGoalResponseFragment = (
  { __typename?: 'GoalResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'Error' }
    & DefaultGoalErrorFragment
  )>>, goal?: Maybe<(
    { __typename?: 'Goal' }
    & DefaultGoalFragment
  )> }
);

export type DefaultUserFragment = (
  { __typename?: 'User' }
  & Pick<User, '_id' | 'username'>
);

export type DefaultUserErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type DefaultUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & DefaultUserErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & DefaultUserFragment
  )> }
);

export type AddGoalMutationVariables = Exact<{
  title: Scalars['String'];
  desc: Scalars['String'];
  steps: Array<Scalars['String']>;
}>;


export type AddGoalMutation = (
  { __typename?: 'Mutation' }
  & { addGoal: (
    { __typename?: 'GoalResponse' }
    & DefaultGoalResponseFragment
  ) }
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & DefaultUserResponseFragment
  ) }
);

export type DeleteGoalMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteGoalMutation = (
  { __typename?: 'Mutation' }
  & { deleteGoal?: Maybe<(
    { __typename?: 'DeleteGoalResponse' }
    & Pick<DeleteGoalResponse, 'deleted' | 'id'>
  )> }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & DefaultUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'UserResponse' }
    & DefaultUserResponseFragment
  ) }
);

export type ToggleStepMutationVariables = Exact<{
  goalId: Scalars['String'];
  stepId: Scalars['String'];
}>;


export type ToggleStepMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'toggleStep'>
);

export type GetGoalsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGoalsQuery = (
  { __typename?: 'Query' }
  & { getGoals?: Maybe<Array<(
    { __typename?: 'Goal' }
    & DefaultGoalFragment
  )>> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & DefaultUserFragment
  )> }
);

export const DefaultGoalErrorFragmentDoc = gql`
    fragment DefaultGoalError on Error {
  message
}
    `;
export const DefaultGoalFragmentDoc = gql`
    fragment DefaultGoal on Goal {
  _id
  user_id
  title
  desc
  createdAt
  updatedAt
  steps {
    name
    _id
    completed
    createdAt
    updatedAt
  }
}
    `;
export const DefaultGoalResponseFragmentDoc = gql`
    fragment DefaultGoalResponse on GoalResponse {
  errors {
    ...DefaultGoalError
  }
  goal {
    ...DefaultGoal
  }
}
    ${DefaultGoalErrorFragmentDoc}
${DefaultGoalFragmentDoc}`;
export const DefaultUserErrorFragmentDoc = gql`
    fragment DefaultUserError on FieldError {
  field
  message
}
    `;
export const DefaultUserFragmentDoc = gql`
    fragment DefaultUser on User {
  _id
  username
}
    `;
export const DefaultUserResponseFragmentDoc = gql`
    fragment DefaultUserResponse on UserResponse {
  errors {
    ...DefaultUserError
  }
  user {
    ...DefaultUser
  }
}
    ${DefaultUserErrorFragmentDoc}
${DefaultUserFragmentDoc}`;
export const AddGoalDocument = gql`
    mutation AddGoal($title: String!, $desc: String!, $steps: [String!]!) {
  addGoal(options: {title: $title, desc: $desc, steps: $steps}) {
    ...DefaultGoalResponse
  }
}
    ${DefaultGoalResponseFragmentDoc}`;

export function useAddGoalMutation() {
  return Urql.useMutation<AddGoalMutation, AddGoalMutationVariables>(AddGoalDocument);
};
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...DefaultUserResponse
  }
}
    ${DefaultUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const DeleteGoalDocument = gql`
    mutation DeleteGoal($id: String!) {
  deleteGoal(id: $id) {
    deleted
    id
  }
}
    `;

export function useDeleteGoalMutation() {
  return Urql.useMutation<DeleteGoalMutation, DeleteGoalMutationVariables>(DeleteGoalDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(options: {username: $username, password: $password}) {
    ...DefaultUserResponse
  }
}
    ${DefaultUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  createUser(options: {username: $username, email: $email, password: $password}) {
    ...DefaultUserResponse
  }
}
    ${DefaultUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const ToggleStepDocument = gql`
    mutation ToggleStep($goalId: String!, $stepId: String!) {
  toggleStep(options: {goalId: $goalId, stepId: $stepId})
}
    `;

export function useToggleStepMutation() {
  return Urql.useMutation<ToggleStepMutation, ToggleStepMutationVariables>(ToggleStepDocument);
};
export const GetGoalsDocument = gql`
    query GetGoals {
  getGoals {
    ...DefaultGoal
  }
}
    ${DefaultGoalFragmentDoc}`;

export function useGetGoalsQuery(options: Omit<Urql.UseQueryArgs<GetGoalsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGoalsQuery>({ query: GetGoalsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...DefaultUser
  }
}
    ${DefaultUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};