import { createDraftOutboundLine } from './useDraftOutboundLines';
import { DraftOutboundLine } from 'packages/invoices/src/types';
import { usePackSizeController } from './usePackSizeController';
import { act } from '@testing-library/react';
import {
  InvoiceLineNodeType,
  renderHookWithProvider,
} from '@openmsupply-client/common';

type TestLineParams = {
  id: string;
  itemId: string;
  packSize: number;
  totalNumberOfPacks: number;
  availableNumberOfPacks: number;
  numberOfPacks: number;
  onHold?: boolean;
};

const createTestLine = ({
  itemId,
  packSize,
  totalNumberOfPacks,
  availableNumberOfPacks,
  numberOfPacks,
  id,
  onHold = false,
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

const singlePackSizeLines: DraftOutboundLine[] = [
  createTestLine({
    id: '1',
    packSize: 1,
    totalNumberOfPacks: 1,
    availableNumberOfPacks: 1,
    numberOfPacks: 1,
    itemId: '1',
  }),
  createTestLine({
    id: '2',
    packSize: 1,
    totalNumberOfPacks: 1,
    availableNumberOfPacks: 1,
    numberOfPacks: 1,
    itemId: '1',
  }),
];

const multiplePackSizeLines: DraftOutboundLine[] = [
  createTestLine({
    id: '1',
    packSize: 1,
    totalNumberOfPacks: 1,
    availableNumberOfPacks: 1,
    numberOfPacks: 1,
    itemId: '2',
  }),
  createTestLine({
    id: '2',
    packSize: 2,
    totalNumberOfPacks: 1,
    availableNumberOfPacks: 1,
    numberOfPacks: 1,
    itemId: '2',
  }),
  createTestLine({
    id: '3',
    packSize: 3,
    totalNumberOfPacks: 0,
    availableNumberOfPacks: 0,
    numberOfPacks: 0,
    itemId: '2',
  }),
  createTestLine({
    id: '4',
    packSize: 4,
    totalNumberOfPacks: 1,
    availableNumberOfPacks: 1,
    numberOfPacks: 1,
    onHold: true,
    itemId: '2',
  }),
];

const multipleWithOneAssigned: DraftOutboundLine[] = [
  createTestLine({
    id: '1',
    packSize: 1,
    totalNumberOfPacks: 1,
    availableNumberOfPacks: 1,
    numberOfPacks: 1,
    itemId: '3',
  }),
  createTestLine({
    id: '2',
    packSize: 2,
    totalNumberOfPacks: 0,
    availableNumberOfPacks: 0,
    numberOfPacks: 0,
    itemId: '3',
  }),
];

const singleLineWithNoneAssigned: DraftOutboundLine[] = [
  createTestLine({
    id: '1',
    packSize: 2,
    totalNumberOfPacks: 10,
    availableNumberOfPacks: 10,
    numberOfPacks: 0,
    itemId: '3',
  }),
];

const multipleLinesWithNoneAssigned: DraftOutboundLine[] = [
  createTestLine({
    id: '1',
    packSize: 2,
    totalNumberOfPacks: 10,
    availableNumberOfPacks: 10,
    numberOfPacks: 0,
    itemId: '1',
  }),
  createTestLine({
    id: '1',
    packSize: 2,
    totalNumberOfPacks: 10,
    availableNumberOfPacks: 10,
    numberOfPacks: 0,
    itemId: '2',
  }),
];

const multipleLinesWithNoneAssignedMultiplePackSizes: DraftOutboundLine[] = [
  createTestLine({
    id: '1',
    packSize: 1,
    totalNumberOfPacks: 10,
    availableNumberOfPacks: 10,
    numberOfPacks: 0,
    itemId: '1',
  }),
  createTestLine({
    id: '1',
    packSize: 2,
    totalNumberOfPacks: 10,
    availableNumberOfPacks: 10,
    numberOfPacks: 0,
    itemId: '2',
  }),
];

describe('usePackSizeController', () => {
  it('returns the correct distinct pack sizes of available batches', () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multiplePackSizeLines)
    );
    expect(result.current.packSizes).toEqual([1, 2]);
  });

  it('returns the correct pack sizes options including an option for "any"', () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multiplePackSizeLines)
    );
    expect(result.current.options).toEqual([
      { label: 'label.any', value: -1 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ]);
  });

  it('selects the correct pack size', () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multiplePackSizeLines)
    );

    act(() => {
      result.current.setPackSize(2);
    });

    expect(result.current.selected).toEqual({ label: '2', value: 2 });
  });

  it('has an initial selected state of "any" when there are multiple different pack sizes available', () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multiplePackSizeLines)
    );

    expect(result.current.selected).toEqual({ label: 'label.any', value: -1 });
  });

  it('ignores setting of pack sizes which are invalid', () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multiplePackSizeLines)
    );

    act(() => {
      result.current.setPackSize(10);
    });

    expect(result.current.selected).toEqual({ label: 'label.any', value: -1 });
  });

  it('sets the pack size to any when selected', async () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multiplePackSizeLines)
    );

    act(() => {
      result.current.setPackSize(1);
    });

    expect(result.current.selected).toEqual({
      label: '1',
      value: 1,
    });

    act(() => {
      result.current.setPackSize(-1);
    });

    expect(result.current.selected).toEqual({
      label: 'label.any',
      value: -1,
    });
  });

  it('sets the initial pack size of a set of lines which all have the same pack size, to the only available pack size', () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(singlePackSizeLines)
    );

    expect(result.current.selected).toEqual({
      label: '1',
      value: 1,
    });
  });

  it('has an initial value of undefined when the array is empty', () => {
    const { result } = renderHookWithProvider(() => usePackSizeController([]));

    expect(result.current.selected).toEqual(undefined);
  });

  it('has an initial value of the unique pack size with assigned packs, not any', () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multipleWithOneAssigned)
    );

    expect(result.current.selected).toEqual({ label: '1', value: 1 });
  });

  it('has an initial value of undefined when the array is empty', () => {
    const { result } = renderHookWithProvider(() => usePackSizeController([]));

    expect(result.current.selected).toEqual(undefined);
  });

  it('has an initial value of the unique pack size with assigned packs, not any', () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multipleWithOneAssigned)
    );

    expect(result.current.selected).toEqual({ label: '1', value: 1 });
  });

  it('has an initial value of the unique pack size with no assigned packs', async () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(singleLineWithNoneAssigned)
    );

    expect(result.current.selected).toEqual({ label: '2', value: 2 });
  });

  it('has an initial value of the unique pack size with no assigned packs', async () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multipleLinesWithNoneAssigned)
    );

    expect(result.current.selected).toEqual({ label: '2', value: 2 });
  });

  it('has an initial value of the unique pack size with no assigned packs', async () => {
    const { result } = renderHookWithProvider(() =>
      usePackSizeController(multipleLinesWithNoneAssignedMultiplePackSizes)
    );

    expect(result.current.selected).toEqual({ label: 'label.any', value: -1 });
  });
});