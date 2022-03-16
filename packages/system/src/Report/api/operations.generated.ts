import * as Types from '@openmsupply-client/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
export type ReportRowFragment = { __typename: 'ReportNode', category: Types.ReportCategory, id: string, name: string };

export type ReportsQueryVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  key: Types.Scalars['String'];
  desc?: Types.InputMaybe<Types.Scalars['Boolean']>;
  filter?: Types.InputMaybe<Types.ReportFilterInput>;
}>;


export type ReportsQuery = { __typename: 'FullQuery', reports: { __typename: 'ReportConnector', totalCount: number, nodes: Array<{ __typename: 'ReportNode', category: Types.ReportCategory, id: string, name: string }> } };

export type PrintReportQueryVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  dataId: Types.Scalars['String'];
  reportId: Types.Scalars['String'];
}>;


export type PrintReportQuery = { __typename: 'FullQuery', printReport: { __typename: 'PrintReportError', error: { __typename: 'FailedToFetchReportData', description: string } | { __typename: 'InvalidReport', description: string } | { __typename: 'RecordNotFound', description: string } } | { __typename: 'PrintReportNode', fileId: string } };

export const ReportRowFragmentDoc = gql`
    fragment ReportRow on ReportNode {
  category
  id
  name
}
    `;
export const ReportsDocument = gql`
    query reports($storeId: String!, $key: String!, $desc: Boolean, $filter: ReportFilterInput) {
  reports(storeId: $storeId, sort: {key: $key, desc: $desc}, filter: $filter) {
    ... on ReportConnector {
      nodes {
        __typename
        ...ReportRow
      }
      totalCount
    }
  }
}
    ${ReportRowFragmentDoc}`;
export const PrintReportDocument = gql`
    query printReport($storeId: String!, $dataId: String!, $reportId: String!) {
  printReport(dataId: $dataId, reportId: $reportId, storeId: $storeId) {
    ... on PrintReportNode {
      __typename
      fileId
    }
    ... on PrintReportError {
      __typename
      error {
        description
        ... on RecordNotFound {
          __typename
          description
        }
        ... on FailedToFetchReportData {
          __typename
          description
        }
        ... on InvalidReport {
          __typename
          description
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
    reports(variables: ReportsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ReportsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReportsQuery>(ReportsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'reports');
    },
    printReport(variables: PrintReportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PrintReportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PrintReportQuery>(PrintReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'printReport');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReportsQuery((req, res, ctx) => {
 *   const { storeId, key, desc, filter } = req.variables;
 *   return res(
 *     ctx.data({ reports })
 *   )
 * })
 */
export const mockReportsQuery = (resolver: ResponseResolver<GraphQLRequest<ReportsQueryVariables>, GraphQLContext<ReportsQuery>, any>) =>
  graphql.query<ReportsQuery, ReportsQueryVariables>(
    'reports',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockPrintReportQuery((req, res, ctx) => {
 *   const { storeId, dataId, reportId } = req.variables;
 *   return res(
 *     ctx.data({ printReport })
 *   )
 * })
 */
export const mockPrintReportQuery = (resolver: ResponseResolver<GraphQLRequest<PrintReportQueryVariables>, GraphQLContext<PrintReportQuery>, any>) =>
  graphql.query<PrintReportQuery, PrintReportQueryVariables>(
    'printReport',
    resolver
  )
