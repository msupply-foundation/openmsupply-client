import {
  formatExpiryDateString,
  useColumns,
  getRowExpandColumn,
  getNotePopoverColumn,
  ColumnAlign,
  GenericColumnKey,
  SortBy,
  Column,
  ifTheSameElseDefault,
  useCurrency,
} from '@openmsupply-client/common';
import { OutboundItem } from '../../types';
import { OutboundLineFragment } from '../api/operations.generated';
import { LocationRowFragment } from '@openmsupply-client/system';

interface UseOutboundColumnOptions {
  sortBy: SortBy<OutboundLineFragment | OutboundItem>;
  onChangeSortBy: (
    column: Column<OutboundLineFragment | OutboundItem>
  ) => SortBy<OutboundLineFragment | OutboundItem>;
}

const expansionColumn = getRowExpandColumn<
  OutboundLineFragment | OutboundItem
>();
const notePopoverColumn = getNotePopoverColumn<
  OutboundLineFragment | OutboundItem
>();

export const useOutboundColumns = ({
  sortBy,
  onChangeSortBy,
}: UseOutboundColumnOptions): Column<OutboundLineFragment | OutboundItem>[] => {
  const { c } = useCurrency();
  return useColumns(
    [
      [
        notePopoverColumn,
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const noteSections = lines
                .map(({ batch, note }) => ({
                  header: batch ?? '',
                  body: note ?? '',
                }))
                .filter(({ body }) => !!body);
              return noteSections.length ? noteSections : null;
            } else {
              return rowData.batch && rowData.note
                ? { header: rowData.batch, body: rowData.note }
                : null;
            }
          },
        },
      ],
      [
        'itemCode',
        {
          getSortValue: row => {
            if ('lines' in row) {
              const { lines } = row;
              const items = lines.map(({ item }) => item);
              return ifTheSameElseDefault(items, 'code', '');
            } else {
              return row.item.code;
            }
          },
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const items = lines.map(({ item }) => item);
              return ifTheSameElseDefault(items, 'code', '');
            } else {
              return rowData.item.code;
            }
          },
        },
      ],
      [
        'itemName',
        {
          getSortValue: row => {
            if ('lines' in row) {
              const { lines } = row;
              const items = lines.map(({ item }) => item);
              return ifTheSameElseDefault(items, 'name', '');
            } else {
              return row.item.name;
            }
          },
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const items = lines.map(({ item }) => item);
              return ifTheSameElseDefault(items, 'name', '');
            } else {
              return rowData.item.name;
            }
          },
        },
      ],
      [
        'batch',
        {
          getSortValue: row => {
            if ('lines' in row) {
              const { lines } = row;
              return ifTheSameElseDefault(lines, 'batch', '[multiple]') ?? '';
            } else {
              return row.batch ?? '';
            }
          },
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
          getSortValue: row => {
            if ('lines' in row) {
              const { lines } = row;
              const expiryDate =
                ifTheSameElseDefault(lines, 'expiryDate', null) ?? '';
              return formatExpiryDateString(expiryDate);
            } else {
              return formatExpiryDateString(row.expiryDate);
            }
          },
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const expiryDate = ifTheSameElseDefault(
                lines,
                'expiryDate',
                null
              );
              return formatExpiryDateString(expiryDate);
            } else {
              return formatExpiryDateString(rowData.expiryDate);
            }
          },
        },
      ],
      [
        'locationName',
        {
          width: 180,
          getSortValue: row => {
            if ('lines' in row) {
              const locations = row.lines
                .map(({ location }) => location)
                .filter(Boolean) as LocationRowFragment[];
              return ifTheSameElseDefault(locations, 'name', '');
            } else {
              return row.location?.name ?? '';
            }
          },
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const locations = rowData.lines
                .map(({ location }) => location)
                .filter(Boolean) as LocationRowFragment[];
              return ifTheSameElseDefault(locations, 'name', '');
            } else {
              return rowData.location?.name ?? '';
            }
          },
        },
      ],
      [
        'itemUnit',
        {
          getSortValue: row => {
            if ('lines' in row) {
              return row.lines[0].item.unitName ?? '';
            } else {
              return row.item.unitName ?? '';
            }
          },
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const items = rowData.lines.map(({ item }) => item);
              return ifTheSameElseDefault(items, 'unitName', '') ?? '';
            } else {
              return rowData.item.unitName ?? '';
            }
          },
        },
      ],
      [
        'numberOfPacks',
        {
          width: 150,
          getSortValue: row => {
            if ('lines' in row) {
              const { lines } = row;
              const packSize = ifTheSameElseDefault(lines, 'packSize', '');
              if (packSize) {
                return lines.reduce(
                  (acc, value) => acc + value.numberOfPacks,
                  0
                );
              } else {
                return '';
              }
            } else {
              return row.numberOfPacks;
            }
          },
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              const packSize = ifTheSameElseDefault(lines, 'packSize', '');
              if (packSize) {
                return lines.reduce(
                  (acc, value) => acc + value.numberOfPacks,
                  0
                );
              } else {
                return '';
              }
            } else {
              return rowData.numberOfPacks;
            }
          },
        },
      ],
      [
        'packSize',
        {
          width: 150,
          getSortValue: row => {
            if ('lines' in row) {
              const { lines } = row;
              return ifTheSameElseDefault(lines, 'packSize', '') ?? '';
            } else {
              return row.packSize ?? '';
            }
          },
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
      {
        label: 'label.unit-quantity',
        key: 'unitQuantity',
        width: 100,
        align: ColumnAlign.Right,
        accessor: ({ rowData }) => {
          if ('lines' in rowData) {
            const { lines } = rowData;
            return lines.reduce(
              (acc, line) => line.packSize * line.numberOfPacks + acc,
              0
            );
          } else {
            return rowData.packSize * rowData.numberOfPacks;
          }
        },
      },
      {
        label: 'label.unit-price',
        key: 'sellPricePerUnit',
        width: 200,
        align: ColumnAlign.Right,
        accessor: ({ rowData }) => {
          if ('lines' in rowData) {
            return c(
              Object.values(rowData.lines).reduce(
                (sum, batch) =>
                  sum + (batch.sellPricePerPack ?? 0) / batch.packSize,
                0
              )
            ).format();
          } else {
            return c(
              (rowData.sellPricePerPack ?? 0) / rowData.packSize
            ).format();
          }
        },
        getSortValue: rowData => {
          if ('lines' in rowData) {
            return c(
              Object.values(rowData.lines).reduce(
                (sum, batch) =>
                  sum + (batch.sellPricePerPack ?? 0) / batch.packSize,
                0
              )
            ).format();
          } else {
            return c(
              (rowData.sellPricePerPack ?? 0) / rowData.packSize
            ).format();
          }
        },
      },
      {
        label: 'label.line-total',
        key: 'lineTotal',
        width: 200,
        align: ColumnAlign.Right,
        accessor: ({ rowData }) => {
          if ('lines' in rowData) {
            return c(
              Object.values(rowData.lines).reduce(
                (sum, batch) =>
                  sum + batch.sellPricePerPack * batch.numberOfPacks,
                0
              )
            ).format();
          } else {
            const x = c(
              rowData.sellPricePerPack * rowData.numberOfPacks
            ).format();
            return x;
          }
        },
        getSortValue: row => {
          if ('lines' in row) {
            return c(
              Object.values(row.lines).reduce(
                (sum, batch) =>
                  sum + batch.sellPricePerPack * batch.numberOfPacks,
                0
              )
            ).format();
          } else {
            const x = c(row.sellPricePerPack * row.numberOfPacks).format();
            return x;
          }
        },
      },
      expansionColumn,
      GenericColumnKey.Selection,
    ],
    { onChangeSortBy, sortBy },
    [sortBy]
  );
};
