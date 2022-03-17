import * as Types from '@openmsupply-client/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
export type ItemWithStatsFragment = { __typename: 'ItemNode', id: string, name: string, code: string, unitName?: string | null, stats: { __typename: 'ItemStatsNode', averageMonthlyConsumption: number, availableStockOnHand: number, availableMonthsOfStockOnHand: number } };

export type InsertRequestMutationVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  input: Types.InsertRequestRequisitionInput;
}>;


export type InsertRequestMutation = { __typename: 'FullMutation', insertRequestRequisition: { __typename: 'InsertRequestRequisitionError', error: { __typename: 'OtherPartyNotASupplier', description: string } } | { __typename: 'RequisitionNode', id: string, requisitionNumber: number } };

export type UpdateRequestMutationVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  input: Types.UpdateRequestRequisitionInput;
}>;


export type UpdateRequestMutation = { __typename: 'FullMutation', updateRequestRequisition: { __typename: 'RequisitionNode', id: string, requisitionNumber: number } | { __typename: 'UpdateRequestRequisitionError', error: { __typename: 'CannotEditRequisition', description: string } | { __typename: 'OtherPartyNotASupplier', description: string } | { __typename: 'RecordNotFound', description: string } } };

export type DeleteRequestMutationVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  input: Types.BatchRequestRequisitionInput;
}>;


export type DeleteRequestMutation = { __typename: 'FullMutation', batchRequestRequisition: { __typename: 'BatchRequestRequisitionResponse', deleteRequestRequisitions?: Array<{ __typename: 'DeleteRequestRequisitionResponseWithId', id: string, response: { __typename: 'DeleteRequestRequisitionError', error: { __typename: 'CannotDeleteRequisitionWithLines', description: string } | { __typename: 'CannotEditRequisition', description: string } | { __typename: 'RecordNotFound', description: string } } | { __typename: 'DeleteResponse', id: string } }> | null } };

export type RequestLineChartDataFragment = { __typename: 'ItemChartDataNode', consumptionHistory: { __typename: 'ConsumptionHistoryConnector', nodes: Array<{ __typename: 'ConsumptionHistoryNode', amc: number, consumption: number, date: string }> }, suggestedQuantityCalculation: { __typename: 'SuggestedQuantityCalculationNode', stockOnHand: number, suggested: number, minimumStockOnHand: number, maximumStockOnHand: number, averageMonthlyConsumption: number }, stockEvolution: { __typename: 'StockEvolutionConnector', nodes: Array<{ __typename: 'StockEvolutionNode', date: string, historicStockOnHand?: number | null, projectedStockOnHand?: number | null }> } };

export type RequestLineFragment = { __typename: 'RequisitionLineNode', id: string, itemId: string, requestedQuantity: number, suggestedQuantity: number, comment?: string | null, itemStats: { __typename: 'ItemStatsNode', availableStockOnHand: number, availableMonthsOfStockOnHand: number, averageMonthlyConsumption: number }, item: { __typename: 'ItemNode', id: string, name: string, code: string, unitName?: string | null, stats: { __typename: 'ItemStatsNode', averageMonthlyConsumption: number, availableStockOnHand: number, availableMonthsOfStockOnHand: number } }, chartData: { __typename: 'ItemChartDataNode', consumptionHistory: { __typename: 'ConsumptionHistoryConnector', nodes: Array<{ __typename: 'ConsumptionHistoryNode', amc: number, consumption: number, date: string }> }, suggestedQuantityCalculation: { __typename: 'SuggestedQuantityCalculationNode', stockOnHand: number, suggested: number, minimumStockOnHand: number, maximumStockOnHand: number, averageMonthlyConsumption: number }, stockEvolution: { __typename: 'StockEvolutionConnector', nodes: Array<{ __typename: 'StockEvolutionNode', date: string, historicStockOnHand?: number | null, projectedStockOnHand?: number | null }> } } };

export type RequestFragment = { __typename: 'RequisitionNode', id: string, type: Types.RequisitionNodeType, status: Types.RequisitionNodeStatus, createdDatetime: string, sentDatetime?: string | null, finalisedDatetime?: string | null, requisitionNumber: number, colour?: string | null, theirReference?: string | null, comment?: string | null, otherPartyName: string, otherPartyId: string, maxMonthsOfStock: number, minMonthsOfStock: number, user?: { __typename: 'UserNode', username: string, email?: string | null } | null, lines: { __typename: 'RequisitionLineConnector', totalCount: number, nodes: Array<{ __typename: 'RequisitionLineNode', id: string, itemId: string, requestedQuantity: number, suggestedQuantity: number, comment?: string | null, itemStats: { __typename: 'ItemStatsNode', availableStockOnHand: number, availableMonthsOfStockOnHand: number, averageMonthlyConsumption: number }, item: { __typename: 'ItemNode', id: string, name: string, code: string, unitName?: string | null, stats: { __typename: 'ItemStatsNode', averageMonthlyConsumption: number, availableStockOnHand: number, availableMonthsOfStockOnHand: number } }, chartData: { __typename: 'ItemChartDataNode', consumptionHistory: { __typename: 'ConsumptionHistoryConnector', nodes: Array<{ __typename: 'ConsumptionHistoryNode', amc: number, consumption: number, date: string }> }, suggestedQuantityCalculation: { __typename: 'SuggestedQuantityCalculationNode', stockOnHand: number, suggested: number, minimumStockOnHand: number, maximumStockOnHand: number, averageMonthlyConsumption: number }, stockEvolution: { __typename: 'StockEvolutionConnector', nodes: Array<{ __typename: 'StockEvolutionNode', date: string, historicStockOnHand?: number | null, projectedStockOnHand?: number | null }> } } }> }, shipments: { __typename: 'InvoiceConnector', totalCount: number, nodes: Array<{ __typename: 'InvoiceNode', id: string, invoiceNumber: number, createdDatetime: string, user?: { __typename: 'UserNode', username: string } | null }> }, otherParty: { __typename: 'NameNode', id: string, code: string, isCustomer: boolean, isSupplier: boolean, name: string, store?: { __typename: 'StoreNode', id: string, code: string } | null } };

export type RequestByNumberQueryVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  requisitionNumber: Types.Scalars['Int'];
}>;


export type RequestByNumberQuery = { __typename: 'FullQuery', requisitionByNumber: { __typename: 'RecordNotFound', description: string } | { __typename: 'RequisitionNode', id: string, type: Types.RequisitionNodeType, status: Types.RequisitionNodeStatus, createdDatetime: string, sentDatetime?: string | null, finalisedDatetime?: string | null, requisitionNumber: number, colour?: string | null, theirReference?: string | null, comment?: string | null, otherPartyName: string, otherPartyId: string, maxMonthsOfStock: number, minMonthsOfStock: number, otherParty: { __typename: 'NameNode', id: string, name: string, code: string, isCustomer: boolean, isSupplier: boolean, store?: { __typename: 'StoreNode', id: string, code: string } | null }, user?: { __typename: 'UserNode', username: string, email?: string | null } | null, lines: { __typename: 'RequisitionLineConnector', totalCount: number, nodes: Array<{ __typename: 'RequisitionLineNode', id: string, itemId: string, requestedQuantity: number, suggestedQuantity: number, comment?: string | null, itemStats: { __typename: 'ItemStatsNode', availableStockOnHand: number, availableMonthsOfStockOnHand: number, averageMonthlyConsumption: number }, item: { __typename: 'ItemNode', id: string, name: string, code: string, unitName?: string | null, stats: { __typename: 'ItemStatsNode', averageMonthlyConsumption: number, availableStockOnHand: number, availableMonthsOfStockOnHand: number } }, chartData: { __typename: 'ItemChartDataNode', consumptionHistory: { __typename: 'ConsumptionHistoryConnector', nodes: Array<{ __typename: 'ConsumptionHistoryNode', amc: number, consumption: number, date: string }> }, suggestedQuantityCalculation: { __typename: 'SuggestedQuantityCalculationNode', stockOnHand: number, suggested: number, minimumStockOnHand: number, maximumStockOnHand: number, averageMonthlyConsumption: number }, stockEvolution: { __typename: 'StockEvolutionConnector', nodes: Array<{ __typename: 'StockEvolutionNode', date: string, historicStockOnHand?: number | null, projectedStockOnHand?: number | null }> } } }> }, shipments: { __typename: 'InvoiceConnector', totalCount: number, nodes: Array<{ __typename: 'InvoiceNode', id: string, invoiceNumber: number, createdDatetime: string, user?: { __typename: 'UserNode', username: string } | null }> } } };

export type RequestRowFragment = { __typename: 'RequisitionNode', colour?: string | null, comment?: string | null, createdDatetime: string, finalisedDatetime?: string | null, id: string, otherPartyName: string, requisitionNumber: number, sentDatetime?: string | null, status: Types.RequisitionNodeStatus, theirReference?: string | null, type: Types.RequisitionNodeType, otherPartyId: string };

export type RequestsQueryVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  filter?: Types.InputMaybe<Types.RequisitionFilterInput>;
  page?: Types.InputMaybe<Types.PaginationInput>;
  sort?: Types.InputMaybe<Array<Types.RequisitionSortInput> | Types.RequisitionSortInput>;
}>;


export type RequestsQuery = { __typename: 'FullQuery', requisitions: { __typename: 'RequisitionConnector', totalCount: number, nodes: Array<{ __typename: 'RequisitionNode', colour?: string | null, comment?: string | null, createdDatetime: string, finalisedDatetime?: string | null, id: string, otherPartyName: string, requisitionNumber: number, sentDatetime?: string | null, status: Types.RequisitionNodeStatus, theirReference?: string | null, type: Types.RequisitionNodeType, otherPartyId: string }> } };

export type InsertRequestLineMutationVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  input: Types.InsertRequestRequisitionLineInput;
}>;


export type InsertRequestLineMutation = { __typename: 'FullMutation', insertRequestRequisitionLine: { __typename: 'InsertRequestRequisitionLineError', error: { __typename: 'CannotEditRequisition', description: string } | { __typename: 'ForeignKeyError', description: string, key: Types.ForeignKey } | { __typename: 'RequisitionLineWithItemIdExists', description: string } } | { __typename: 'RequisitionLineNode', id: string } };

export type UpdateRequestLineMutationVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  input: Types.UpdateRequestRequisitionLineInput;
}>;


export type UpdateRequestLineMutation = { __typename: 'FullMutation', updateRequestRequisitionLine: { __typename: 'RequisitionLineNode', id: string } | { __typename: 'UpdateRequestRequisitionLineError', error: { __typename: 'CannotEditRequisition', description: string } | { __typename: 'ForeignKeyError', description: string, key: Types.ForeignKey } | { __typename: 'RecordNotFound', description: string } } };

export type AddFromMasterListMutationVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
  requestId: Types.Scalars['String'];
  masterListId: Types.Scalars['String'];
}>;


export type AddFromMasterListMutation = { __typename: 'FullMutation', addFromMasterList: { __typename: 'AddFromMasterListError', error: { __typename: 'CannotEditRequisition', description: string } | { __typename: 'MasterListNotFoundForThisStore', description: string } | { __typename: 'RecordNotFound', description: string } } | { __typename: 'RequisitionLineConnector', totalCount: number } };

export type DeleteRequestLinesMutationVariables = Types.Exact<{
  ids?: Types.InputMaybe<Array<Types.DeleteRequestRequisitionLineInput> | Types.DeleteRequestRequisitionLineInput>;
  storeId: Types.Scalars['String'];
}>;


export type DeleteRequestLinesMutation = { __typename: 'FullMutation', batchRequestRequisition: { __typename: 'BatchRequestRequisitionResponse', deleteRequestRequisitionLines?: Array<{ __typename: 'DeleteRequestRequisitionLineResponseWithId', id: string, response: { __typename: 'DeleteRequestRequisitionLineError', error: { __typename: 'CannotEditRequisition', description: string } | { __typename: 'RecordNotFound', description: string } } | { __typename: 'DeleteResponse', id: string } }> | null } };

export const ItemWithStatsFragmentDoc = gql`
    fragment ItemWithStats on ItemNode {
  id
  name
  code
  unitName
  stats(storeId: $storeId) {
    averageMonthlyConsumption
    availableStockOnHand
    availableMonthsOfStockOnHand
  }
}
    `;
export const RequestLineChartDataFragmentDoc = gql`
    fragment RequestLineChartData on ItemChartDataNode {
  __typename
  consumptionHistory {
    nodes {
      amc
      consumption
      date
    }
  }
  suggestedQuantityCalculation {
    stockOnHand
    suggested
    minimumStockOnHand
    maximumStockOnHand
    averageMonthlyConsumption
  }
  stockEvolution {
    nodes {
      date
      historicStockOnHand
      projectedStockOnHand
    }
  }
}
    `;
export const RequestLineFragmentDoc = gql`
    fragment RequestLine on RequisitionLineNode {
  id
  itemId
  requestedQuantity
  suggestedQuantity
  comment
  itemStats {
    __typename
    availableStockOnHand
    availableMonthsOfStockOnHand
    averageMonthlyConsumption
  }
  item {
    ...ItemWithStats
  }
  chartData {
    ...RequestLineChartData
  }
}
    ${ItemWithStatsFragmentDoc}
${RequestLineChartDataFragmentDoc}`;
export const RequestFragmentDoc = gql`
    fragment Request on RequisitionNode {
  __typename
  id
  type
  status
  createdDatetime
  sentDatetime
  finalisedDatetime
  requisitionNumber
  colour
  theirReference
  comment
  otherPartyName
  otherPartyId
  maxMonthsOfStock
  minMonthsOfStock
  user {
    __typename
    username
    email
  }
  lines {
    __typename
    totalCount
    nodes {
      ...RequestLine
    }
  }
  shipments {
    __typename
    totalCount
    nodes {
      __typename
      id
      invoiceNumber
      createdDatetime
      user {
        __typename
        username
      }
    }
  }
  otherParty(storeId: $storeId) {
    id
    code
    isCustomer
    isSupplier
    name
    store {
      id
      code
    }
  }
}
    ${RequestLineFragmentDoc}`;
export const RequestRowFragmentDoc = gql`
    fragment RequestRow on RequisitionNode {
  colour
  comment
  createdDatetime
  finalisedDatetime
  id
  otherPartyName
  requisitionNumber
  sentDatetime
  status
  theirReference
  type
  otherPartyId
}
    `;
export const InsertRequestDocument = gql`
    mutation insertRequest($storeId: String!, $input: InsertRequestRequisitionInput!) {
  insertRequestRequisition(input: $input, storeId: $storeId) {
    ... on RequisitionNode {
      __typename
      id
      requisitionNumber
    }
    ... on InsertRequestRequisitionError {
      __typename
      error {
        description
        ... on OtherPartyNotASupplier {
          __typename
          description
        }
      }
    }
  }
}
    `;
export const UpdateRequestDocument = gql`
    mutation updateRequest($storeId: String!, $input: UpdateRequestRequisitionInput!) {
  updateRequestRequisition(input: $input, storeId: $storeId) {
    ... on RequisitionNode {
      __typename
      id
      requisitionNumber
    }
    ... on UpdateRequestRequisitionError {
      __typename
      error {
        description
        ... on RecordNotFound {
          __typename
          description
        }
        ... on CannotEditRequisition {
          __typename
          description
        }
        ... on OtherPartyNotASupplier {
          __typename
          description
        }
      }
    }
  }
}
    `;
export const DeleteRequestDocument = gql`
    mutation deleteRequest($storeId: String!, $input: BatchRequestRequisitionInput!) {
  batchRequestRequisition(storeId: $storeId, input: $input) {
    deleteRequestRequisitions {
      id
      response {
        ... on DeleteRequestRequisitionError {
          __typename
          error {
            description
            ... on RecordNotFound {
              __typename
              description
            }
            ... on CannotDeleteRequisitionWithLines {
              __typename
              description
            }
            ... on CannotEditRequisition {
              __typename
              description
            }
          }
        }
        ... on DeleteResponse {
          id
        }
      }
    }
  }
}
    `;
export const RequestByNumberDocument = gql`
    query requestByNumber($storeId: String!, $requisitionNumber: Int!) {
  requisitionByNumber(
    requisitionNumber: $requisitionNumber
    type: REQUEST
    storeId: $storeId
  ) {
    __typename
    ... on RequisitionNode {
      ...Request
      otherParty(storeId: $storeId) {
        __typename
        ... on NameNode {
          id
          name
          code
          isCustomer
          isSupplier
        }
      }
    }
    ... on RecordNotFound {
      __typename
      description
    }
  }
}
    ${RequestFragmentDoc}`;
export const RequestsDocument = gql`
    query requests($storeId: String!, $filter: RequisitionFilterInput, $page: PaginationInput, $sort: [RequisitionSortInput!]) {
  requisitions(storeId: $storeId, filter: $filter, page: $page, sort: $sort) {
    ... on RequisitionConnector {
      totalCount
      nodes {
        ...RequestRow
      }
    }
  }
}
    ${RequestRowFragmentDoc}`;
export const InsertRequestLineDocument = gql`
    mutation insertRequestLine($storeId: String!, $input: InsertRequestRequisitionLineInput!) {
  insertRequestRequisitionLine(input: $input, storeId: $storeId) {
    ... on RequisitionLineNode {
      __typename
      id
    }
    ... on InsertRequestRequisitionLineError {
      __typename
      error {
        description
        ... on CannotEditRequisition {
          __typename
          description
        }
        ... on ForeignKeyError {
          __typename
          description
          key
        }
        ... on RequisitionLineWithItemIdExists {
          __typename
          description
        }
      }
    }
  }
}
    `;
export const UpdateRequestLineDocument = gql`
    mutation updateRequestLine($storeId: String!, $input: UpdateRequestRequisitionLineInput!) {
  updateRequestRequisitionLine(input: $input, storeId: $storeId) {
    ... on RequisitionLineNode {
      __typename
      id
    }
    ... on UpdateRequestRequisitionLineError {
      __typename
      error {
        description
        ... on CannotEditRequisition {
          __typename
          description
        }
        ... on ForeignKeyError {
          __typename
          description
          key
        }
        ... on RecordNotFound {
          __typename
          description
        }
      }
    }
  }
}
    `;
export const AddFromMasterListDocument = gql`
    mutation addFromMasterList($storeId: String!, $requestId: String!, $masterListId: String!) {
  addFromMasterList(
    input: {requestRequisitionId: $requestId, masterListId: $masterListId}
    storeId: $storeId
  ) {
    ... on RequisitionLineConnector {
      __typename
      totalCount
    }
    ... on AddFromMasterListError {
      __typename
      error {
        description
        ... on RecordNotFound {
          __typename
          description
        }
        ... on CannotEditRequisition {
          __typename
          description
        }
        ... on MasterListNotFoundForThisStore {
          __typename
          description
        }
      }
    }
  }
}
    `;
export const DeleteRequestLinesDocument = gql`
    mutation deleteRequestLines($ids: [DeleteRequestRequisitionLineInput!], $storeId: String!) {
  batchRequestRequisition(
    input: {deleteRequestRequisitionLines: $ids}
    storeId: $storeId
  ) {
    deleteRequestRequisitionLines {
      id
      response {
        ... on DeleteRequestRequisitionLineError {
          __typename
          error {
            description
            ... on RecordNotFound {
              __typename
              description
            }
            ... on CannotEditRequisition {
              __typename
              description
            }
          }
        }
        ... on DeleteResponse {
          id
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
    insertRequest(variables: InsertRequestMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InsertRequestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InsertRequestMutation>(InsertRequestDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'insertRequest');
    },
    updateRequest(variables: UpdateRequestMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateRequestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateRequestMutation>(UpdateRequestDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateRequest');
    },
    deleteRequest(variables: DeleteRequestMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteRequestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteRequestMutation>(DeleteRequestDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteRequest');
    },
    requestByNumber(variables: RequestByNumberQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RequestByNumberQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestByNumberQuery>(RequestByNumberDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'requestByNumber');
    },
    requests(variables: RequestsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RequestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestsQuery>(RequestsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'requests');
    },
    insertRequestLine(variables: InsertRequestLineMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InsertRequestLineMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InsertRequestLineMutation>(InsertRequestLineDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'insertRequestLine');
    },
    updateRequestLine(variables: UpdateRequestLineMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateRequestLineMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateRequestLineMutation>(UpdateRequestLineDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateRequestLine');
    },
    addFromMasterList(variables: AddFromMasterListMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddFromMasterListMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddFromMasterListMutation>(AddFromMasterListDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addFromMasterList');
    },
    deleteRequestLines(variables: DeleteRequestLinesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteRequestLinesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteRequestLinesMutation>(DeleteRequestLinesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteRequestLines');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockInsertRequestMutation((req, res, ctx) => {
 *   const { storeId, input } = req.variables;
 *   return res(
 *     ctx.data({ insertRequestRequisition })
 *   )
 * })
 */
export const mockInsertRequestMutation = (resolver: ResponseResolver<GraphQLRequest<InsertRequestMutationVariables>, GraphQLContext<InsertRequestMutation>, any>) =>
  graphql.mutation<InsertRequestMutation, InsertRequestMutationVariables>(
    'insertRequest',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateRequestMutation((req, res, ctx) => {
 *   const { storeId, input } = req.variables;
 *   return res(
 *     ctx.data({ updateRequestRequisition })
 *   )
 * })
 */
export const mockUpdateRequestMutation = (resolver: ResponseResolver<GraphQLRequest<UpdateRequestMutationVariables>, GraphQLContext<UpdateRequestMutation>, any>) =>
  graphql.mutation<UpdateRequestMutation, UpdateRequestMutationVariables>(
    'updateRequest',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteRequestMutation((req, res, ctx) => {
 *   const { storeId, input } = req.variables;
 *   return res(
 *     ctx.data({ batchRequestRequisition })
 *   )
 * })
 */
export const mockDeleteRequestMutation = (resolver: ResponseResolver<GraphQLRequest<DeleteRequestMutationVariables>, GraphQLContext<DeleteRequestMutation>, any>) =>
  graphql.mutation<DeleteRequestMutation, DeleteRequestMutationVariables>(
    'deleteRequest',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestByNumberQuery((req, res, ctx) => {
 *   const { storeId, requisitionNumber } = req.variables;
 *   return res(
 *     ctx.data({ requisitionByNumber })
 *   )
 * })
 */
export const mockRequestByNumberQuery = (resolver: ResponseResolver<GraphQLRequest<RequestByNumberQueryVariables>, GraphQLContext<RequestByNumberQuery>, any>) =>
  graphql.query<RequestByNumberQuery, RequestByNumberQueryVariables>(
    'requestByNumber',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestsQuery((req, res, ctx) => {
 *   const { storeId, filter, page, sort } = req.variables;
 *   return res(
 *     ctx.data({ requisitions })
 *   )
 * })
 */
export const mockRequestsQuery = (resolver: ResponseResolver<GraphQLRequest<RequestsQueryVariables>, GraphQLContext<RequestsQuery>, any>) =>
  graphql.query<RequestsQuery, RequestsQueryVariables>(
    'requests',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockInsertRequestLineMutation((req, res, ctx) => {
 *   const { storeId, input } = req.variables;
 *   return res(
 *     ctx.data({ insertRequestRequisitionLine })
 *   )
 * })
 */
export const mockInsertRequestLineMutation = (resolver: ResponseResolver<GraphQLRequest<InsertRequestLineMutationVariables>, GraphQLContext<InsertRequestLineMutation>, any>) =>
  graphql.mutation<InsertRequestLineMutation, InsertRequestLineMutationVariables>(
    'insertRequestLine',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateRequestLineMutation((req, res, ctx) => {
 *   const { storeId, input } = req.variables;
 *   return res(
 *     ctx.data({ updateRequestRequisitionLine })
 *   )
 * })
 */
export const mockUpdateRequestLineMutation = (resolver: ResponseResolver<GraphQLRequest<UpdateRequestLineMutationVariables>, GraphQLContext<UpdateRequestLineMutation>, any>) =>
  graphql.mutation<UpdateRequestLineMutation, UpdateRequestLineMutationVariables>(
    'updateRequestLine',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAddFromMasterListMutation((req, res, ctx) => {
 *   const { storeId, requestId, masterListId } = req.variables;
 *   return res(
 *     ctx.data({ addFromMasterList })
 *   )
 * })
 */
export const mockAddFromMasterListMutation = (resolver: ResponseResolver<GraphQLRequest<AddFromMasterListMutationVariables>, GraphQLContext<AddFromMasterListMutation>, any>) =>
  graphql.mutation<AddFromMasterListMutation, AddFromMasterListMutationVariables>(
    'addFromMasterList',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteRequestLinesMutation((req, res, ctx) => {
 *   const { ids, storeId } = req.variables;
 *   return res(
 *     ctx.data({ batchRequestRequisition })
 *   )
 * })
 */
export const mockDeleteRequestLinesMutation = (resolver: ResponseResolver<GraphQLRequest<DeleteRequestLinesMutationVariables>, GraphQLContext<DeleteRequestLinesMutation>, any>) =>
  graphql.mutation<DeleteRequestLinesMutation, DeleteRequestLinesMutationVariables>(
    'deleteRequestLines',
    resolver
  )
