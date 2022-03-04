import * as Types from '@openmsupply-client/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
export type AuthTokenQueryVariables = Types.Exact<{
  username: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type AuthTokenQuery = { __typename: 'FullQuery', authToken: { __typename: 'AuthToken', token: string } | { __typename: 'AuthTokenError', error: { __typename: 'DatabaseError', description: string, fullError: string } | { __typename: 'InternalError', description: string, fullError: string } | { __typename: 'InvalidCredentials', description: string } | { __typename: 'UserNameDoesNotExist', description: string } } };

export type RefreshTokenQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RefreshTokenQuery = { __typename: 'FullQuery', refreshToken: { __typename: 'RefreshToken', token: string } | { __typename: 'RefreshTokenError', error: { __typename: 'DatabaseError', description: string, fullError: string } | { __typename: 'InternalError', description: string, fullError: string } | { __typename: 'InvalidToken', description: string } | { __typename: 'NoRefreshTokenProvided', description: string } | { __typename: 'NotARefreshToken', description: string } | { __typename: 'TokenExpired', description: string } } };


export const AuthTokenDocument = gql`
    query authToken($username: String!, $password: String!) {
  authToken(password: $password, username: $username) {
    ... on AuthToken {
      __typename
      token
    }
    ... on AuthTokenError {
      __typename
      error {
        ... on UserNameDoesNotExist {
          __typename
          description
        }
        ... on InvalidCredentials {
          __typename
          description
        }
        ... on DatabaseError {
          __typename
          description
          fullError
        }
        ... on InternalError {
          __typename
          description
          fullError
        }
        description
      }
    }
  }
}
    `;
export const RefreshTokenDocument = gql`
    query refreshToken {
  refreshToken {
    ... on RefreshToken {
      __typename
      token
    }
    ... on RefreshTokenError {
      __typename
      error {
        description
        ... on DatabaseError {
          __typename
          description
          fullError
        }
        ... on TokenExpired {
          __typename
          description
        }
        ... on NotARefreshToken {
          __typename
          description
        }
        ... on NoRefreshTokenProvided {
          __typename
          description
        }
        ... on InvalidToken {
          __typename
          description
        }
        ... on InternalError {
          __typename
          description
          fullError
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    authToken(variables: AuthTokenQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AuthTokenQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AuthTokenQuery>(AuthTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'authToken');
    },
    refreshToken(variables?: RefreshTokenQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RefreshTokenQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RefreshTokenQuery>(RefreshTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'refreshToken');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAuthTokenQuery((req, res, ctx) => {
 *   const { username, password } = req.variables;
 *   return res(
 *     ctx.data({ authToken })
 *   )
 * })
 */
export const mockAuthTokenQuery = (resolver: ResponseResolver<GraphQLRequest<AuthTokenQueryVariables>, GraphQLContext<AuthTokenQuery>, any>) =>
  graphql.query<AuthTokenQuery, AuthTokenQueryVariables>(
    'authToken',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRefreshTokenQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ refreshToken })
 *   )
 * })
 */
export const mockRefreshTokenQuery = (resolver: ResponseResolver<GraphQLRequest<RefreshTokenQueryVariables>, GraphQLContext<RefreshTokenQuery>, any>) =>
  graphql.query<RefreshTokenQuery, RefreshTokenQueryVariables>(
    'refreshToken',
    resolver
  )
