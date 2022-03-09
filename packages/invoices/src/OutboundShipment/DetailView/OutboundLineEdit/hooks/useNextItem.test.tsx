import {
  TestingProvider,
  InvoiceLineNode,
  InvoiceLineNodeType,
  ItemNodeType,
} from '@openmsupply-client/common';
import { renderHook } from '@testing-library/react-hooks';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import { useNextItem } from './useNextItem';

const getInvoice = () => ({
  __typename: 'InvoiceNode',
  id: '',
  lines: {
    __typename: 'InvoiceLineConnector',
    nodes: [] as InvoiceLineNode[],
    totalCount: 0,
  },
  otherParty: {
    __typename: 'NameNode',
    id: '',
  },
  pricing: {
    __typename: 'InvoicePricingNode',
  },
});

const getLines = (): InvoiceLineNode[] => [
  {
    id: 'a',
    itemId: 'a',
    sellPricePerPack: 0,
    type: InvoiceLineNodeType.StockOut,
    __typename: 'InvoiceLineNode',
    costPricePerPack: 0,
    totalAfterTax: 0,
    totalBeforeTax: 0,
    invoiceId: '',
    itemCode: '',
    itemName: '',
    numberOfPacks: 0,
    packSize: 1,
    item: {
      id: 'a',
      __typename: 'ItemNode',
      availableBatches: {
        __typename: 'StockLineConnector',
        nodes: [],
        totalCount: 0,
      },
      code: '',
      type: ItemNodeType.Stock,
      isVisible: true,
      name: '',
      stats: {
        __typename: 'ItemStatsNode',
        availableStockOnHand: 0,
        availableMonthsOfStockOnHand: 0,
        averageMonthlyConsumption: 0,
      },
    },
  },
  {
    id: 'b',
    itemId: 'b',
    sellPricePerPack: 0,
    type: InvoiceLineNodeType.StockOut,
    __typename: 'InvoiceLineNode',
    costPricePerPack: 0,
    totalAfterTax: 0,
    totalBeforeTax: 0,
    invoiceId: '',
    itemCode: '',
    itemName: '',
    numberOfPacks: 0,
    packSize: 1,
    item: {
      id: 'b',
      __typename: 'ItemNode',
      type: ItemNodeType.Stock,
      availableBatches: {
        __typename: 'StockLineConnector',
        nodes: [],
        totalCount: 0,
      },
      code: '',
      isVisible: true,
      name: '',
      stats: {
        __typename: 'ItemStatsNode',
        availableStockOnHand: 0,
        availableMonthsOfStockOnHand: 0,
        averageMonthlyConsumption: 0,
      },
    },
  },
  {
    id: 'c',
    itemId: 'c',
    sellPricePerPack: 0,
    type: InvoiceLineNodeType.StockOut,
    __typename: 'InvoiceLineNode',
    costPricePerPack: 0,
    totalAfterTax: 0,
    totalBeforeTax: 0,
    invoiceId: '',
    itemCode: '',
    itemName: '',
    numberOfPacks: 0,
    packSize: 1,
    item: {
      id: 'c',
      __typename: 'ItemNode',
      type: ItemNodeType.Stock,
      availableBatches: {
        __typename: 'StockLineConnector',
        nodes: [],
        totalCount: 0,
      },
      code: '',
      isVisible: true,
      name: '',
      stats: {
        __typename: 'ItemStatsNode',
        availableStockOnHand: 0,
        availableMonthsOfStockOnHand: 0,
        averageMonthlyConsumption: 0,
      },
    },
  },
];

describe('useNextItem', () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('eventually equals an object where the next item is equal to the next item in sorted order.', () => {
    const invoiceByNumber = getInvoice();
    invoiceByNumber.lines.nodes = getLines();
    const handler = graphql.query('outboundByNumber', (_, res, ctx) => {
      return res(ctx.data({ invoiceByNumber }));
    });
    server.use(handler);
    const result = renderHook(() => useNextItem('a'), {
      wrapper: TestingProvider,
    });

    return result.waitForNextUpdate().then(() => {
      expect(result.result.current.next).toEqual(
        expect.objectContaining({ id: invoiceByNumber.lines.nodes[1]?.id })
      );
      expect(result.result.current.disabled).toEqual(false);
    });
  });

  it('returns a null item and a disabled state when the current item is the "last" of the sorted list of items.', async () => {
    const handler = graphql.query('outboundByNumber', (_, res, ctx) => {
      const invoiceByNumber = getInvoice();
      invoiceByNumber.lines.nodes = getLines();
      return res(ctx.data({ invoiceByNumber }));
    });

    server.use(handler);
    const result = renderHook(() => useNextItem('c'), {
      wrapper: TestingProvider,
    });

    return result.waitForNextUpdate().then(() => {
      expect(result.result.current.next).toEqual(null);
      expect(result.result.current).toEqual(
        expect.objectContaining({ disabled: true })
      );
    });
  });
});
