import {
  InvoiceLineNodeType,
  InvoiceNodeStatus,
  DateUtils,
  SortUtils,
} from '@openmsupply-client/common';
import { DraftOutboundLine } from './../../../types';

export const sumAvailableQuantity = (
  draftOutboundLines: DraftOutboundLine[]
) => {
  const sum = draftOutboundLines.reduce(
    (acc, { stockLine, packSize }) =>
      acc + (stockLine?.availableNumberOfPacks ?? 0) * packSize,
    0
  );

  return sum;
};

export const getAllocatedQuantity = (
  draftOutboundLines: DraftOutboundLine[]
) => {
  return draftOutboundLines.reduce(
    (acc, { numberOfPacks, packSize }) => acc + numberOfPacks * packSize,
    0
  );
};

export const issueStock = (
  draftOutboundLines: DraftOutboundLine[],
  idToIssue: string,
  value: number
) => {
  const foundRowIdx = draftOutboundLines.findIndex(
    ({ id }) => id === idToIssue
  );
  const foundRow = draftOutboundLines[foundRowIdx];
  if (!foundRow) return [];

  const newDraftOutboundLines = [...draftOutboundLines];
  newDraftOutboundLines[foundRowIdx] = {
    ...foundRow,
    numberOfPacks: value,
    isUpdated: true,
  };

  return newDraftOutboundLines;
};

export const allocateQuantities =
  (status: InvoiceNodeStatus, draftOutboundLines: DraftOutboundLine[]) =>
  (newValue: number, issuePackSize: number | null) => {
    // if invalid quantity entered, don't allocate
    if (newValue < 0 || Number.isNaN(newValue)) {
      return;
    }

    // If there is only one batch row, then it is the placeholder.
    // Assign all of the new value and short circuit.
    if (draftOutboundLines.length === 1 && status === InvoiceNodeStatus.New) {
      const placeholder = draftOutboundLines.find(
        ({ type }) => type === InvoiceLineNodeType.UnallocatedStock
      );
      return issueStock(
        draftOutboundLines,
        placeholder?.id ?? '',
        newValue * (issuePackSize || 1)
      );
    }

    // calculations are normalised to units
    const totalToAllocate = newValue * (issuePackSize || 1);
    let toAllocate = totalToAllocate;

    const newDraftOutboundLines = draftOutboundLines.map(batch => ({
      ...batch,
      numberOfPacks: 0,
    }));
    const validBatches = newDraftOutboundLines
      .filter(
        ({ expiryDate, packSize, stockLine }) =>
          (issuePackSize ? packSize === issuePackSize : true) &&
          (stockLine?.availableNumberOfPacks ?? 0) > 0 &&
          !stockLine?.onHold &&
          !(!!expiryDate && DateUtils.isExpired(new Date(expiryDate)))
      )
      .sort(SortUtils.byExpiryAsc);

    validBatches.forEach(batch => {
      const draftOutboundLineIdx = newDraftOutboundLines.findIndex(
        ({ id }) => batch.id === id
      );
      const draftOutboundLine = newDraftOutboundLines[draftOutboundLineIdx];
      if (!draftOutboundLine) return null;
      if (toAllocate < 0) return null;

      const availableUnits =
        (draftOutboundLine.stockLine?.availableNumberOfPacks ?? 0) *
        draftOutboundLine.packSize;
      const unitsToAllocate = Math.min(toAllocate, availableUnits);
      const allocatedNumberOfPacks = Math.ceil(
        unitsToAllocate / draftOutboundLine.packSize
      );

      toAllocate -= allocatedNumberOfPacks * draftOutboundLine.packSize;

      newDraftOutboundLines[draftOutboundLineIdx] = {
        ...draftOutboundLine,
        numberOfPacks: allocatedNumberOfPacks,
      };
    });

    // if over-allocated due to pack sizes available, reduce allocation as needed
    if (toAllocate < 0) {
      toAllocate *= -1;
      validBatches.sort(SortUtils.byExpiryDesc).forEach(batch => {
        const draftOutboundLineIdx = newDraftOutboundLines.findIndex(
          ({ id }) => batch.id === id
        );
        const draftOutboundLine = newDraftOutboundLines[draftOutboundLineIdx];
        if (!draftOutboundLine) return null;
        if (draftOutboundLine.packSize > toAllocate) return null;
        if (draftOutboundLine.numberOfPacks === 0) return null;

        const allocatedUnits =
          draftOutboundLine.numberOfPacks * draftOutboundLine.packSize;
        const unitsToReduce = Math.min(toAllocate, allocatedUnits);
        const numberOfPacks = Math.floor(
          (allocatedUnits - unitsToReduce) / draftOutboundLine.packSize
        );

        toAllocate -= unitsToReduce;

        newDraftOutboundLines[draftOutboundLineIdx] = {
          ...draftOutboundLine,
          numberOfPacks: numberOfPacks,
        };
      });
    }

    if (status === InvoiceNodeStatus.New) {
      const placeholderIdx = newDraftOutboundLines.findIndex(
        ({ type }) => type === InvoiceLineNodeType.UnallocatedStock
      );
      const placeholder = newDraftOutboundLines[placeholderIdx];

      if (!placeholder) throw new Error('No placeholder within item editing');

      newDraftOutboundLines[placeholderIdx] = {
        ...placeholder,
        numberOfPacks: placeholder.numberOfPacks + toAllocate,
      };
    }

    return newDraftOutboundLines;
  };
