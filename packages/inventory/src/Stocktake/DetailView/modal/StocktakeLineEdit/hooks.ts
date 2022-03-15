import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { RecordPatch, FnUtils } from '@openmsupply-client/common';
import {
  useStockLines,
  ItemRowFragment,
  StockLineFragment,
} from '@openmsupply-client/system';
import { useStocktakeFields } from './../../../api/hooks';
import { StocktakeLineFragment } from './../../../api/operations.generated';
import {
  useStocktakeRows,
  useStocktakeLines,
  useSaveStocktakeLines,
} from '../../../api';

export type DraftStocktakeLine = Omit<
  StocktakeLineFragment,
  '__typename' | 'item'
> & {
  countThisLine: boolean;
  isCreated?: boolean;
  isUpdated?: boolean;
  stocktakeId: string;
};

const stocktakeLineToDraftLine = (
  stocktakeId: string,
  line: StocktakeLineFragment
): DraftStocktakeLine => {
  return {
    isCreated: false,
    isUpdated: false,
    countThisLine: true,
    ...line,
    stocktakeId,
  };
};

const createDraftLine = (
  stocktakeId: string,
  item: ItemRowFragment
): DraftStocktakeLine => {
  return {
    stocktakeId,
    snapshotNumberOfPacks: 0,
    countThisLine: true,
    isCreated: true,
    isUpdated: false,
    id: FnUtils.generateUUID(),
    expiryDate: null,
    itemId: item.id,
    sellPricePerPack: 0,
    costPricePerPack: 0,
    packSize: 1,
    location: null,
  };
};

const stockLineToDraftLine = (
  stocktakeId: string,
  line: StockLineFragment
): DraftStocktakeLine => {
  return {
    stocktakeId,
    countThisLine: true,
    isCreated: true,
    isUpdated: false,
    ...line,
    snapshotNumberOfPacks: line.totalNumberOfPacks,
    expiryDate: line.expiryDate ? line.expiryDate : null,
    id: FnUtils.generateUUID(),
  };
};

const useDraftStocktakeLines = (
  item: ItemRowFragment | null
): [DraftStocktakeLine[], Dispatch<SetStateAction<DraftStocktakeLine[]>>] => {
  const { id } = useStocktakeFields('id');
  const { data: stocktakeLines } = useStocktakeLines(item?.id);
  const { data: stockLines } = useStockLines(item?.id || '');

  const [draftLines, setDraftLines] = React.useState<DraftStocktakeLine[]>([]);

  useEffect(() => {
    if (item) {
      setDraftLines(lines => {
        const existing =
          stocktakeLines?.map(line => stocktakeLineToDraftLine(id, line)) ?? [];
        const filteredExisting = existing.filter(
          line => !lines.find(l => l.id === line.id)
        );
        return [...lines, ...filteredExisting];
      });
    }
  }, [stocktakeLines, item]);

  useEffect(() => {
    const uncountedLines =
      stockLines?.nodes.filter(
        ({ id }) =>
          !stocktakeLines?.some(({ stockLine }) => stockLine?.id === id)
      ) ?? [];
    const uncounted = uncountedLines.map(line =>
      stockLineToDraftLine(id, line)
    );
    setDraftLines(lines => [...lines, ...uncounted]);
  }, [stockLines]);

  useEffect(() => {
    setDraftLines(lines => {
      return lines.filter(({ itemId }) => itemId === item?.id);
    });
  }, [item]);

  return [draftLines, setDraftLines];
};

interface useStocktakeLineEditController {
  draftLines: DraftStocktakeLine[];
  update: (patch: RecordPatch<StocktakeLineFragment>) => void;
  addLine: () => void;
  save: (lines: DraftStocktakeLine[]) => void;
  isLoading: boolean;
  nextItem: ItemRowFragment | null;
}

export const useNextItem = (currentItemId?: string): ItemRowFragment | null => {
  const { items } = useStocktakeRows();
  if (!items || !currentItemId) return null;

  const numberOfItems = items.length;
  const currentIdx = items.findIndex(({ item }) => item?.id === currentItemId);
  const nextItem = items[(currentIdx + 1) % numberOfItems];

  if (currentIdx === -1 || currentIdx === numberOfItems - 1 || !nextItem) {
    return null;
  }

  return nextItem.item ?? null;
};

export const useStocktakeLineEdit = (
  item: ItemRowFragment | null
): useStocktakeLineEditController => {
  const { id } = useStocktakeFields('id');
  const nextItem = useNextItem(item?.id);
  const [draftLines, setDraftLines] = useDraftStocktakeLines(item);
  const { mutate: save, isLoading } = useSaveStocktakeLines();

  const update = (patch: RecordPatch<StocktakeLineFragment>) => {
    setDraftLines(lines => {
      return lines.map(line => {
        if (line.id === patch.id) {
          return {
            ...line,
            ...patch,
            isUpdated: !line.isCreated,
          };
        }
        return line;
      });
    });
  };

  const addLine = () => {
    if (item) {
      setDraftLines(lines => [...lines, createDraftLine(id, item)]);
    }
  };

  return { draftLines, update, addLine, save, isLoading, nextItem };
};
