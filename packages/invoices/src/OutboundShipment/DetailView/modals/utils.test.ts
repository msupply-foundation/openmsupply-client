import {
  InvoiceNodeStatus,
  generateUUID,
  InvoiceLineNodeType,
} from '@openmsupply-client/common/';
import { DraftOutboundLine } from './../../../types';
import {
  createDraftOutboundLine,
  createPlaceholderRow,
} from './hooks/useDraftOutboundLines';
import { allocateQuantities } from './utils';

type TestLineParams = {
  id?: string;
  itemId?: string;
  packSize?: number;
  totalNumberOfPacks?: number;
  availableNumberOfPacks?: number;
  numberOfPacks?: number;
  onHold?: boolean;
  expiryDate?: string;
};

const createTestLine = ({
  itemId = generateUUID(),
  packSize = 1,
  totalNumberOfPacks = 1,
  availableNumberOfPacks = 1,
  numberOfPacks = 0,
  id = generateUUID(),
  onHold = false,
  expiryDate,
}: TestLineParams): DraftOutboundLine =>
  createDraftOutboundLine({
    invoiceId: '',
    invoiceLine: {
      id,
      sellPricePerPack: 0,
      item: {
        id: itemId,
        code: '',
        name: '',
        unitName: '',
        __typename: 'ItemNode',
      },
      type: InvoiceLineNodeType.StockOut,
      packSize,
      invoiceId: '',
      __typename: 'InvoiceLineNode',
      numberOfPacks,
      expiryDate,
      stockLine: {
        __typename: 'StockLineNode',
        id: 'a',
        totalNumberOfPacks,
        availableNumberOfPacks,
        onHold,
        sellPricePerPack: 0,
        itemId,
        packSize,
      },
    },
  });

const getPlaceholder = (
  line?: Partial<DraftOutboundLine>
): DraftOutboundLine => ({
  ...createPlaceholderRow('', 'placeholder'),
  ...line,
});

describe('allocateQuantities - standard behaviour.', () => {
  it('allocates quantity to a row', () => {
    const placeholder = getPlaceholder();
    const lineOne = createTestLine({
      availableNumberOfPacks: 10,
      totalNumberOfPacks: 10,
    });
    const draftOutboundLines = [lineOne, placeholder];
    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const expected = [{ ...lineOne, numberOfPacks: 3 }, placeholder];

    expect(allocate(3, 1)).toEqual(expected);
  });

  it('allocates quantity spread over multiple lines', () => {
    const one = createTestLine({ id: '1' });
    const two = createTestLine({ id: '2' });
    const placeholder = getPlaceholder();
    const draftOutboundLines = [one, two, placeholder];
    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const lineOne = { ...one };
    lineOne.numberOfPacks = 1;
    const lineTwo = { ...two };
    lineTwo.numberOfPacks = 1;

    const expected = [lineOne, lineTwo, placeholder];
    const allocated = allocate(2, 1);

    expect(allocated).toEqual(expected);
  });
});

describe('Allocate quantities - placeholder row behaviour', () => {
  it('allocates excess quantity to the placeholder row when the status is new', () => {
    const one = createTestLine({ id: '1' });
    const placeholder = getPlaceholder();
    const draftOutboundLines = [one, placeholder];
    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const lineOne = { ...one };
    lineOne.numberOfPacks = 1;
    const placeholderLine = { ...placeholder, numberOfPacks: 9 };

    const expected = [lineOne, placeholderLine];

    expect(allocate(10, 1)).toEqual(expected);
  });

  it('allocates quantity spread over multiple lines and placeholders when there is excess', () => {
    const one = createTestLine({ id: '1' });
    const two = createTestLine({ id: '2' });
    const placeholder = getPlaceholder();
    const draftOutboundLines = [one, two, placeholder];
    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const lineOne = { ...one };
    lineOne.numberOfPacks = 1;
    const lineTwo = { ...two };
    lineTwo.numberOfPacks = 1;
    const placeholderLine = { ...placeholder };
    placeholderLine.numberOfPacks = 1;

    const expected = [lineOne, lineTwo, placeholderLine];

    expect(allocate(3, 1)).toEqual(expected);
  });

  it('does not allocate excess quantity to the placeholder row when the status is not new', () => {
    const run = (status: InvoiceNodeStatus) => {
      const one = createTestLine({ id: '1' });
      const placeholder = getPlaceholder();

      const draftOutboundLines = [one, placeholder];
      const allocate = allocateQuantities(status, draftOutboundLines);

      const lineOne = { ...one };
      lineOne.numberOfPacks = 1;
      const placeholderLine = getPlaceholder();

      const expected = [lineOne, placeholderLine];
      return { allocate, expected };
    };

    const allocatedStatusTest = run(InvoiceNodeStatus.Allocated);
    expect(allocatedStatusTest.allocate(10, 1)).toEqual(
      allocatedStatusTest.expected
    );

    const pickedStatusTest = run(InvoiceNodeStatus.Picked);
    expect(pickedStatusTest.allocate(10, 1)).toEqual(pickedStatusTest.expected);

    const deliveredStatusTest = run(InvoiceNodeStatus.Delivered);
    expect(deliveredStatusTest.allocate(10, 1)).toEqual(
      deliveredStatusTest.expected
    );

    const verifiedStatusTest = run(InvoiceNodeStatus.Verified);
    expect(verifiedStatusTest.allocate(10, 1)).toEqual(
      verifiedStatusTest.expected
    );
  });
});

describe('Allocate quantities - differing pack size behaviour', () => {
  it('does not allocate any quantity to lines which are not of the pack size selected', () => {
    const one = createTestLine({ id: '1' });
    const two = createTestLine({ id: '2', packSize: 2 });
    const placeholder = getPlaceholder();

    const draftOutboundLines = [one, two, placeholder];
    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const lineOne = { ...one };
    lineOne.numberOfPacks = 1;
    const lineTwo = { ...two };
    const placeholderLine = { ...placeholder };
    placeholderLine.numberOfPacks = 2;

    const expected = [lineOne, lineTwo, placeholderLine];

    expect(allocate(3, 1)).toEqual(expected);
  });

  it('after changing to a different pack size, all quantities allocated to the original pack size are removed.', () => {
    const one = createTestLine({ id: '1' });
    const two = createTestLine({ id: '2', packSize: 2 });
    const placeholder = getPlaceholder();
    const draftOutboundLines = [one, two, placeholder];
    let allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const lineOne = { ...one };
    lineOne.numberOfPacks = 1;
    const lineTwo = { ...two };
    const placeholderLine = { ...placeholder };
    placeholderLine.numberOfPacks = 2;

    const expected = [lineOne, lineTwo, placeholderLine];

    expect(allocate(3, 1)).toEqual(expected);

    allocate = allocateQuantities(InvoiceNodeStatus.New, expected);
    const lineOneAfterChange = { ...one };
    const lineTwoAfterChange = { ...two };
    lineTwoAfterChange.numberOfPacks = 1;
    const placeholderAfterChange = { ...placeholder };
    placeholderAfterChange.numberOfPacks = 4;
    const expectedAfterChange = [
      lineOneAfterChange,
      lineTwoAfterChange,
      placeholderAfterChange,
    ];

    expect(allocate(3, 2)).toEqual(expectedAfterChange);
  });
});

describe('Allocating quantities - behaviour when mixing placeholders and pack sizes greater than one', () => {
  it('issues any left over quantities to the placeholder at a pack size of 1 (the number of units) when issuing to pack sizes of one', () => {
    const one = createTestLine({ id: '1' });
    const placeholder = getPlaceholder();
    const draftOutboundLines = [one, placeholder];
    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const lineOne = { ...one };
    lineOne.numberOfPacks = 1;
    const placeholderLine = { ...placeholder };
    placeholderLine.numberOfPacks = 9;

    const expected = [lineOne, placeholderLine];

    expect(allocate(10, 1)).toEqual(expected);
  });
  it('issues any left over quantities to the placeholder at a pack size of 1 (the number of units) when issuing to non-one pack sizes', () => {
    const one = createTestLine({ id: '2', packSize: 2 });
    const placeholder = getPlaceholder();
    const draftOutboundLines = [one, placeholder];
    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const lineOne = { ...one };
    lineOne.numberOfPacks = 1;
    // The total number of units being allocated is 20. The line with a pack size of two has 1 pack available.
    // So, 18 units should be assigned to the placeholder - the 9 remaining packs * the pack size of two.
    const placeholderLine = { ...placeholder };
    placeholderLine.numberOfPacks = 18;

    const expected = [lineOne, placeholderLine];

    expect(allocate(10, 2)).toEqual(expected);
  });
});

describe('Allocated quantities - expiry date behaviour', () => {
  const now = Date.now();
  const expiringFirstDate = new Date(now + 10000).toISOString();
  const expiringLastDate = new Date(now + 100000).toISOString();

  const expiringLastLine = createTestLine({
    id: '1',
    expiryDate: expiringLastDate,
    availableNumberOfPacks: 10,
    totalNumberOfPacks: 10,
  });

  const expiringFirstLine = createTestLine({
    id: '2',
    expiryDate: expiringFirstDate,
    availableNumberOfPacks: 10,
    totalNumberOfPacks: 10,
  });
  const placeholder = getPlaceholder();
  it('issues to lines with the earliest expiring invoice line', () => {
    const draftOutboundLines = [
      { ...expiringLastLine },
      { ...expiringFirstLine },
      { ...placeholder },
    ];

    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const expiringLast = { ...expiringLastLine };
    const expiringFirst = { ...expiringFirstLine, numberOfPacks: 10 };

    expect(allocate(10, 1)).toEqual([expiringLast, expiringFirst, placeholder]);
  });
  it('allocates units to the first expiry batch, with left overs being assigned to later expiring lines', () => {
    const draftOutboundLines = [
      { ...expiringLastLine },
      { ...expiringFirstLine },
      { ...placeholder },
    ];

    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const expiringLast = { ...expiringLastLine, numberOfPacks: 5 };
    const expiringFirst = { ...expiringFirstLine, numberOfPacks: 10 };

    expect(allocate(15, 1)).toEqual([expiringLast, expiringFirst, placeholder]);
  });
});

describe('Allocated quantities - behaviour for expired lines', () => {
  const now = Date.now();
  const expiredDate = new Date(now - 100000).toISOString();
  const notExpiredDate = new Date(now + 100000).toISOString();

  const expiringLastLine = createTestLine({
    id: '1',
    expiryDate: notExpiredDate,
    availableNumberOfPacks: 10,
    totalNumberOfPacks: 10,
  });

  const expiredLine = createTestLine({
    id: '2',
    expiryDate: expiredDate,
    availableNumberOfPacks: 10,
    totalNumberOfPacks: 10,
  });

  const placeholder = getPlaceholder();

  it('does not allocate any quantity to expired lines', () => {
    const draftOutboundLines = [
      { ...expiringLastLine },
      { ...expiredLine },
      { ...placeholder },
    ];

    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const expiringLast = { ...expiringLastLine, numberOfPacks: 10 };
    const expired = { ...expiredLine, numberOfPacks: 0 };

    expect(allocate(10, 1)).toEqual([expiringLast, expired, placeholder]);
  });
});

describe('Allocated quantities - behaviour generally not possible through the UI', () => {
  it('issues all quantities to the place holder when issuing to a pack size that has no available quantity', () => {
    const one = createTestLine({ id: '1', packSize: 2 });
    const placeholder = getPlaceholder();

    const draftOutboundLines = [one, placeholder];
    const allocate = allocateQuantities(
      InvoiceNodeStatus.New,
      draftOutboundLines
    );

    const lineOne = { ...one };
    const placeholderLine = { ...placeholder };
    placeholderLine.numberOfPacks = 10;

    const expected = [lineOne, placeholderLine];

    expect(allocate(10, 1)).toEqual(expected);
  });
});
