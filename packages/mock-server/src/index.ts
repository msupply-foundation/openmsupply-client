import { Invoice } from '@openmsupply-client/common';
import { ApolloServer, gql } from 'apollo-server';
import { Schema } from './schema';

import { TestQueries, TestQueryResolvers, TestTypes } from './schema/Test';

export interface PaginationOptions {
  first: number;
  offset: number;
  sort?: keyof Invoice;
  desc: boolean;
}

export interface ListResponse<T> {
  totalLength: number;
  data: T[];
}

const typeDefs = gql`
  ${Schema.Item.Types}
  ${Schema.Invoice.Types}
  ${Schema.InvoiceLine.Types}
  ${Schema.StockLine.Types}
  
  ${TestTypes}
  
  ${Schema.Invoice.Inputs}
  
  type Query {
    ${Schema.Item.Queries}
    ${Schema.Invoice.Queries}
    ${TestQueries}
    ${Schema.StockLine.Queries}
  }

  type Mutation {
    ${Schema.Invoice.Mutations}
  }
`;

const resolvers = {
  Query: {
    ...TestQueryResolvers,
    ...Schema.Item.QueryResolvers,
    ...Schema.Invoice.QueryResolvers,
    ...Schema.StockLine.QueryResolvers,
  },
  Mutation: {
    ...Schema.Invoice.MutationResolvers,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(
    `🚀🚀🚀 Server   @ ${url}         🚀🚀🚀\n🤖🤖🤖 GraphiQL @ ${url}graphiql 🤖🤖🤖`
  );
});

export { handlers } from './worker/handlers';
