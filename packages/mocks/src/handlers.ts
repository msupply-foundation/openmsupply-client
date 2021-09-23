import { graphql } from 'msw';

import faker from 'faker';

const choose = (options: unknown[]) => {
  const numberOfOptions = options.length;

  const randomIdx = Math.floor(Math.random() * numberOfOptions);

  return options[randomIdx];
};

const getItems = () =>
  Array.from({ length: Math.random() * 10 }).map(() => ({
    id: `${faker.datatype.uuid()}`,
    code: `${faker.random.alpha({ count: 6 })}`,
    name: `${faker.commerce.productName()}`,
    packSize: 1,
    quantity: faker.datatype.number(100),
  }));

const TransactionData = Array.from({ length: 100 }).map((_, i) => ({
  id: `${i}`,
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  status: choose(['Confirmed', 'Finalised']),
  entered: faker.date.past().toString(),
  confirmed: faker.date.past().toString(),
  invoiceNumber: `${i}`,
  total: `$${faker.commerce.price()}`,
  color: 'grey',
  type: choose([
    'Customer invoice',
    'Supplier invoice',
    'Customer credit',
    'Supplier credit',
  ]),
  comment: faker.commerce.productDescription(),
  items: getItems(),
}));

const parseValue = (object: any, key: string) => {
  const value = object[key];
  if (typeof value === 'string') {
    const valueAsNumber = Number.parseFloat(value);

    if (!Number.isNaN(valueAsNumber)) return valueAsNumber;
    return value.toUpperCase(); // ignore case
  }
  return value;
};

const getDataSorter = (sortKey: string, desc: boolean) => (a: any, b: any) => {
  const valueA = parseValue(a, sortKey);
  const valueB = parseValue(b, sortKey);

  if (valueA < valueB) {
    return desc ? 1 : -1;
  }
  if (valueA > valueB) {
    return desc ? -1 : 1;
  }

  return 0;
};

const upsertTransaction = graphql.mutation(
  'upsertTransaction',
  (request, response, context) => {
    const { variables } = request;
    const { transactionPatch } = variables;

    const { id, ...patch } = transactionPatch;

    if (!id) {
      const newTransaction = { id: String(TransactionData.length), ...patch };
      TransactionData.push(newTransaction);
      return response(context.data({ upsertTransaction: newTransaction }));
    }

    const idx = TransactionData.findIndex(
      ({ id: filterId }) => id === filterId
    );
    TransactionData[idx] = { ...TransactionData[idx], ...patch };

    return response(context.data({ upsertTransaction: TransactionData[idx] }));
  }
);

const deleteTransactions = graphql.mutation(
  'deleteTransactions',
  (request, response, context) => {
    const { variables } = request;
    const { transactions } = variables;

    transactions.forEach(({ id: deleteId }: { id: string }) => {
      const idx = TransactionData.findIndex(({ id }) => deleteId === id);
      TransactionData.splice(idx, 1);
    });

    return response(context.data({ transactions }));
  }
);

export const transactionList = graphql.query(
  'transactions',
  (request, response, context) => {
    const { variables } = request;
    const { offset = 0, first = 25, sort, desc } = variables;

    const data = TransactionData;

    if (sort) {
      const sortData = getDataSorter(sort, desc);
      data.sort(sortData);
    }

    return response(
      context.data({
        transactions: {
          data: data.slice(offset, offset + first),
          totalLength: TransactionData.length,
        },
      })
    );
  }
);

export const transactionDetail = graphql.query(
  'transaction',
  (request, response, context) => {
    const { variables } = request;
    const { id } = variables;
    const transaction = TransactionData[Number(id)];
    return response(context.data({ transaction }));
  }
);

export const permissionError = graphql.query(
  'error401',
  (_, response, context) => {
    return response(
      context.status(401),
      context.data({ data: [{ id: 0, message: 'Permission Denied' }] })
    );
  }
);

export const serverError = graphql.query('error500', (_, response, context) => {
  return response(
    context.status(500),
    context.data({
      data: [{ id: 0, message: 'Server Error' }],
    })
  );
});

export const handlers = [
  transactionList,
  transactionDetail,
  upsertTransaction,
  deleteTransactions,
  permissionError,
  serverError,
];
