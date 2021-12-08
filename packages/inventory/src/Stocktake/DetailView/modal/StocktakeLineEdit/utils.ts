import React from 'react';
import { generateUUID } from '@openmsupply-client/common';
import { createStocktakeItem } from '../../reducer';

import { StocktakeItem, StocktakeLine } from './../../../../types';

export const createStocktakeRow = (
  stocktakeItem: StocktakeItem,
  stockLineId = '',
  seed?: StocktakeLine
): StocktakeLine => {
  const id = generateUUID();
  const row = {
    id,
    batch: '',
    costPricePerPack: 0,
    sellPricePerPack: 0,
    expiryDate: undefined,
    itemId: stocktakeItem.id,
    itemCode: stocktakeItem.itemCode(),
    itemName: stocktakeItem.itemName(),
    snapshotNumPacks: undefined,
    snapshotPackSize: undefined,
    countedNumPacks: undefined,
    isCreated: !seed,
    isUpdated: false,
    isDeleted: false,
    stockLineId,
    ...seed,
    update: (key: string, value: string) => {
      if (key === 'batch') {
        row.batch = value;
      }
      if (key === 'countedNumPacks') {
        row.countedNumPacks = Number(value);
      }

      if (key === 'costPricePerPack') {
        row.costPricePerPack = Number(value);
      }
      if (key === 'sellPricePerPack') {
        row.sellPricePerPack = Number(value);
      }

      row.isUpdated = true;

      stocktakeItem.upsertLine?.(row);
    },
  };

  return row;
};

export const wrapStocktakeItem = (
  seed: StocktakeItem,
  updater: React.Dispatch<React.SetStateAction<StocktakeItem>>
): StocktakeItem => {
  const wrapped = {
    ...seed,
    deleteLines: (ids: string[]) => {
      updater(state => {
        console.log('-------------------------------------------');
        console.log(
          'ids',
          ids,
          state.lines.map(({ id }) => id)
        );
        console.log('-------------------------------------------');
        return {
          ...state,
          lines: state.lines.filter(({ id }) => !ids.includes(id)),
        };
      });
    },
    deleteLine: (id: string) => {
      console.log('deleteLine', id);
      const lines = seed.lines.filter(l => l.id !== id);

      wrapped.lines = lines;
      updater({ ...wrapped });
    },
    upsertLine: (line: StocktakeLine) => {
      updater(state => {
        const updatedLines = [...state.lines];
        const idx = updatedLines.findIndex(l => l.id === line.id);
        if (idx !== -1) {
          updatedLines[idx] = line;
        } else {
          updatedLines.push(line);
        }

        const updatedItem = {
          ...state,
          ...createStocktakeItem(seed.id, updatedLines),
        };

        return updatedItem;
      });
    },
  };

  const lines = seed.lines.map(batch =>
    createStocktakeRow(wrapped, batch.stockLineId, batch)
  );

  return { ...wrapped, lines };
};
