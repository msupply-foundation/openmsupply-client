import { useState } from 'react';
import {
  getRowExpandColumn,
  GenericColumnKey,
  getSumOfKeyReducer,
  getUnitQuantity,
  getNotePopoverColumn,
  ifTheSameElseDefault,
  useColumns,
  Column,
} from '@openmsupply-client/common';
import { InvoiceLine, InboundShipmentItem } from './../../types';

export const useInboundShipmentColumns = (): Column<
  InvoiceLine | InboundShipmentItem
>[] => {
  const [widths, setWidths] = useState<number[]>([
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  ]);

  const updateWidth = (i: number) => (x: number) => {
    const newWidths = [...widths];
    newWidths[i] = x;
    setWidths(newWidths);
  };

  const columns = useColumns<InvoiceLine | InboundShipmentItem>(
    [
      [
        getNotePopoverColumn(),
        {
          minWidth: 100,
          width: widths[0],
          onChangeWidth: updateWidth(0),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const noteSections = rowData.lines
                .map(({ batch, note }) => ({
                  header: batch ?? '',
                  body: note ?? '',
                }))
                .filter(({ body }) => !!body);

              return noteSections.length ? noteSections : null;
            } else {
              return rowData.note
                ? { header: rowData.batch ?? '', body: rowData.note }
                : null;
            }
          },
        },
      ],
      [
        'itemCode',
        {
          minWidth: 100,
          width: widths[1],
          onChangeWidth: updateWidth(1),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'itemCode', '');
            } else {
              return rowData.itemCode;
            }
          },
        },
      ],
      [
        'itemName',
        {
          minWidth: 100,
          width: widths[2],
          onChangeWidth: updateWidth(2),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'itemName', '');
            } else {
              return rowData.itemName;
            }
          },
        },
      ],
      [
        'batch',
        {
          minWidth: 100,
          width: widths[3],
          onChangeWidth: updateWidth(3),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'batch', '[multiple]');
            } else {
              return rowData.batch;
            }
          },
        },
      ],
      [
        'expiryDate',
        {
          minWidth: 100,
          width: widths[4],
          onChangeWidth: updateWidth(4),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'expiryDate', '');
            } else {
              return rowData.expiryDate;
            }
          },
        },
      ],
      [
        'locationName',
        {
          minWidth: 100,
          width: widths[5],
          onChangeWidth: updateWidth(5),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'locationName', '');
            } else {
              return rowData?.locationName;
            }
          },
        },
      ],
      [
        'sellPricePerPack',
        {
          minWidth: 100,
          width: widths[6],
          onChangeWidth: updateWidth(6),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'sellPricePerPack', '');
            } else {
              return rowData.sellPricePerPack;
            }
          },
        },
      ],
      [
        'packSize',
        {
          minWidth: 100,
          width: widths[7],
          onChangeWidth: updateWidth(7),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'packSize', '');
            } else {
              return rowData.packSize;
            }
          },
        },
      ],
      [
        'unitQuantity',
        {
          minWidth: 100,
          width: widths[8],
          onChangeWidth: updateWidth(8),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return lines.reduce(getUnitQuantity, 0);
            } else {
              return rowData.packSize * rowData.numberOfPacks;
            }
          },
        },
      ],
      [
        'numberOfPacks',
        {
          minWidth: 100,
          width: widths[9],
          onChangeWidth: updateWidth(9),
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return lines.reduce(getSumOfKeyReducer('numberOfPacks'), 0);
            } else {
              return rowData.numberOfPacks;
            }
          },
        },
      ],
      [
        getRowExpandColumn(),
        {
          onChangeWidth: updateWidth(10),
          minWidth: 100,
          width: widths[10],
        },
      ],
      GenericColumnKey.Selection,
    ],
    {},
    [widths]
  );

  return columns;
};

export const useExpansionColumns = (): Column<InvoiceLine>[] =>
  useColumns([
    'batch',
    'expiryDate',
    'locationName',
    'numberOfPacks',
    'packSize',
    'costPricePerPack',
  ]);
