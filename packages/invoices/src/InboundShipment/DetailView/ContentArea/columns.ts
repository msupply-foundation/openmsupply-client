import {
  Formatter,
  getRowExpandColumn,
  GenericColumnKey,
  getNotePopoverColumn,
  useColumns,
  Column,
  ArrayUtils,
  useCurrency,
  useSortBy,
} from '@openmsupply-client/common';
import { LocationRowFragment } from '@openmsupply-client/system';
import { InboundItem } from './../../../types';
import { InboundLineFragment } from '../../api';

export const useInboundShipmentColumns = () => {
  const { sortBy, onChangeSortBy } = useSortBy<
    InboundLineFragment | InboundItem
  >({
    key: 'itemName',
  });
  const { c } = useCurrency();
  const columns = useColumns<InboundLineFragment | InboundItem>(
    [
      [
        getNotePopoverColumn(),
        {
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
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const items = lines.map(({ item }) => item);
              return ArrayUtils.ifTheSameElseDefault(items, 'code', '');
            } else {
              return rowData.item.code;
            }
          },
          getSortValue: rowData => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const items = lines.map(({ item }) => item);
              return ArrayUtils.ifTheSameElseDefault(items, 'code', '');
            } else {
              return rowData.item.code;
            }
          },
        },
      ],
      [
        'itemName',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const items = lines.map(({ item }) => item);
              return ArrayUtils.ifTheSameElseDefault(items, 'name', '');
            } else {
              return rowData.item.name;
            }
          },
          getSortValue: rowData => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const items = lines.map(({ item }) => item);
              return ArrayUtils.ifTheSameElseDefault(items, 'name', '');
            } else {
              return rowData.item.name;
            }
          },
        },
      ],
      [
        'batch',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ArrayUtils.ifTheSameElseDefault(
                lines,
                'batch',
                '[multiple]'
              );
            } else {
              return rowData.batch;
            }
          },
          getSortValue: rowData => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return (
                ArrayUtils.ifTheSameElseDefault(lines, 'batch', '[multiple]') ??
                ''
              );
            } else {
              return rowData.batch ?? '';
            }
          },
        },
      ],
      [
        'expiryDate',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const expiryDate = ArrayUtils.ifTheSameElseDefault(
                lines,
                'expiryDate',
                null
              );

              return Formatter.expiryDateString(expiryDate);
            } else {
              return Formatter.expiryDateString(rowData.expiryDate);
            }
          },
          getSortValue: rowData => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const expiryDate = ArrayUtils.ifTheSameElseDefault(
                lines,
                'expiryDate',
                null
              );

              return Formatter.expiryDateString(expiryDate);
            } else {
              return Formatter.expiryDateString(rowData.expiryDate);
            }
          },
        },
      ],
      [
        'locationName',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const locations = lines
                .map(({ location }) => location)
                .filter(Boolean) as LocationRowFragment[];
              return ArrayUtils.ifTheSameElseDefault(locations, 'name', '');
            } else {
              return rowData.location?.name ?? '';
            }
          },
          getSortValue: rowData => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const locations = lines
                .map(({ location }) => location)
                .filter(Boolean) as LocationRowFragment[];
              return ArrayUtils.ifTheSameElseDefault(locations, 'name', '');
            } else {
              return rowData.location?.name ?? '';
            }
          },
        },
      ],
      [
        'sellPricePerPack',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return c(
                ArrayUtils.ifTheSameElseDefault(lines, 'sellPricePerPack', '')
              ).format();
            } else {
              return c(rowData.sellPricePerPack).format();
            }
          },
          getSortValue: rowData => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return c(
                ArrayUtils.ifTheSameElseDefault(lines, 'sellPricePerPack', '')
              ).format();
            } else {
              return c(rowData.sellPricePerPack).format();
            }
          },
        },
      ],
      [
        'packSize',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ArrayUtils.ifTheSameElseDefault(lines, 'packSize', '');
            } else {
              return rowData.packSize;
            }
          },
          getSortValue: rowData => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ArrayUtils.ifTheSameElseDefault(lines, 'packSize', '');
            } else {
              return rowData.packSize;
            }
          },
        },
      ],
      [
        'unitQuantity',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ArrayUtils.getUnitQuantity(lines);
            } else {
              return rowData.packSize * rowData.numberOfPacks;
            }
          },
          getSortValue: rowData => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ArrayUtils.getUnitQuantity(lines);
            } else {
              return rowData.packSize * rowData.numberOfPacks;
            }
          },
        },
      ],
      [
        'numberOfPacks',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ArrayUtils.getSum(lines, 'numberOfPacks');
            } else {
              return rowData.numberOfPacks;
            }
          },
          getSortValue: rowData => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ArrayUtils.getSum(lines, 'numberOfPacks');
            } else {
              return rowData.numberOfPacks;
            }
          },
        },
      ],
      getRowExpandColumn(),
      GenericColumnKey.Selection,
    ],
    { sortBy, onChangeSortBy },
    [sortBy, onChangeSortBy]
  );

  return { columns, onChangeSortBy, sortBy };
};

export const useExpansionColumns = (): Column<InboundLineFragment>[] =>
  useColumns([
    'batch',
    'expiryDate',
    'locationName',
    'numberOfPacks',
    'packSize',
    'costPricePerPack',
  ]);
