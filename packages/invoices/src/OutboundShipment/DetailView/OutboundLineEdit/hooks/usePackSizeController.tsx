import { useState, useEffect } from 'react';
import {
  useTranslation,
  InvoiceLineNodeType,
  ifTheSameElseDefault,
  isExpired,
} from '@openmsupply-client/common';
import { DraftOutboundLine } from '../../../../types';

export type PackSizeController = ReturnType<typeof usePackSizeController>;

type PackSizeOption = {
  packSize: number;
  hasAllocated: boolean;
  hasAvailableStock: boolean;
  isPlaceholder: boolean;
  isExpired: boolean;
  isOnHold: boolean | undefined;
  label: string;
  value: number;
};

const isPlaceholder = (line: DraftOutboundLine): boolean =>
  line.type === InvoiceLineNodeType.UnallocatedStock;

const createDistinctPackSizes = (packSizes: PackSizeOption[]) => {
  const packSizeMap: Record<string, PackSizeOption> = {};
  packSizes.forEach(packSizeOption => {
    packSizeMap[String(packSizeOption.packSize)] = packSizeOption;
  });

  return Object.keys(packSizeMap)
    .sort((a, b) => Number(a) - Number(b))
    .reduce((acc, val) => {
      const option = packSizeMap[val];
      if (option) {
        acc.push(option);
        return acc;
      } else return acc;
    }, [] as PackSizeOption[]);
};

const createPackSizeOption = (line: DraftOutboundLine) => ({
  packSize: line.packSize,
  hasAllocated: line.numberOfPacks > 0,
  hasAvailableStock: isPlaceholder(line)
    ? true
    : (line?.stockLine?.availableNumberOfPacks ?? 0) > 0,
  isPlaceholder: isPlaceholder(line),
  isExpired: line.expiryDate ? isExpired(new Date(line.expiryDate)) : false,
  isOnHold: line.stockLine?.onHold,
  value: line.packSize,
  label: String(line.packSize),
});

const createAnyOption = (t: ReturnType<typeof useTranslation>) => () => ({
  packSize: -1,
  isAny: true,
  hasAllocated: false,
  hasAvailableStock: false,
  isPlaceholder: false,
  isExpired: false,
  isOnHold: undefined,
  value: -1,
  label: t('label.any'),
});

export const usePackSizeController = (lines: DraftOutboundLine[]) => {
  const t = useTranslation('distribution');

  // The selected pack size for auto allocation. The initial value
  // will be determined by the lines in the invoice.
  // A specific pack size is selected if:
  //     - All lines with [allocated packs] are of [the same] pack size.
  //     - All lines have [no allocated packs] and are of [the same] pack size.
  // Any is selected when:
  //     - All lines with [allocated packs] are of [different] pack sizes
  //     - All lines have [no allocated packs] and are of [different] pack sizes.
  const [selected, setSelected] = useState<PackSizeOption | undefined>();

  // Helper to set the pack size with just a number.
  const setPackSize = (packSize: number) => {
    const packSizeOption = validPackSizes.find(
      ({ value }) => value === packSize
    );
    if (!packSizeOption) return;
    setSelected(packSizeOption);
  };

  // Create the pack size options.
  const packSizes = lines.map(createPackSizeOption);

  // Valid pack sizes are the pack size of a line which
  // - is a placeholder and has allocated stock.
  // - is a placeholder and is the only line.
  // - No other placeholders.
  // - is not on hold.
  // - is not expired.
  // - has some available stock.
  const validPackSizes = createDistinctPackSizes(
    packSizes.filter(
      packSize =>
        // - is a placeholder and has allocated stock.
        (packSize.isPlaceholder && packSize.hasAllocated) ||
        // - is a placeholder and is the only line.
        (packSize.isPlaceholder && packSizes.length === 1) ||
        // Is not on hold, expired has available stock and is not a placeholder..
        (!packSize.isPlaceholder &&
          !packSize.isOnHold &&
          !packSize.isExpired &&
          packSize.hasAvailableStock)
    )
  );

  // Add the any option when:
  // - There are multiple valid pack sizes to choose from.
  // - There is an expired line.
  // - There are no valid options (i.e. there are no stock lines, only a placeholder).
  const hasExpiredLine = packSizes.some(({ isExpired }) => isExpired);
  if (validPackSizes.length !== 1 || hasExpiredLine) {
    validPackSizes.unshift(createAnyOption(t)());
  }

  const items = lines.map(({ item }) => item);
  const itemId = ifTheSameElseDefault(items, 'id', '');
  useEffect(() => setSelected(undefined), [itemId]);

  // Effect to auto-select an option. Runs when the item changes (selected is null'd) or
  // on mounting.
  useEffect(() => {
    if (!selected && validPackSizes.length) {
      // Select the only available pack size.
      if (validPackSizes.length === 1) {
        const onlyValidPackSize = validPackSizes[0] as PackSizeOption;
        setSelected(onlyValidPackSize);
      }

      // If there are multiple, check if all the allocated lines have the same pack size.
      // If so, select that pack size. Otherwise, select `any`.
      if (validPackSizes.length > 1) {
        const sameAllocated = ifTheSameElseDefault(
          validPackSizes.filter(({ hasAllocated }) => hasAllocated),
          'packSize',
          -1
        );
        setPackSize(sameAllocated);
      }
    }
  }, [selected, validPackSizes]);

  return {
    selected: selected && { label: selected?.label, value: selected?.value },
    setPackSize,
    options: validPackSizes.map(({ label, value }) => ({ label, value })),
  };
};
