import React, { useState } from 'react';
import {
  useColumns,
  NumericTextInput,
  Divider,
  TableCell,
  TableCellProps,
  TableRow,
  useTranslation,
  InvoiceNodeStatus,
  DataTable,
  NonNegativeNumberInputCell,
  ExpiryDateCell,
  CurrencyCell,
  CheckCell,
  ColumnAlign,
  QuantityUtils,
  useDebounceCallback,
} from '@openmsupply-client/common';
import { DraftOutboundLine } from '../../../types';
import { useOutboundLineEditRows, PackSizeController } from './hooks';
import { useOutboundFields } from '../../api';

export interface OutboundLineEditTableProps {
  onChange: (key: string, value: number, packSize: number) => void;
  packSizeController: PackSizeController;
  rows: DraftOutboundLine[];
}

const BasicCell: React.FC<TableCellProps> = ({ sx, ...props }) => (
  <TableCell
    {...props}
    sx={{
      borderBottomWidth: 0,
      color: 'inherit',
      fontSize: '12px',
      fontWeight: 'normal',
      padding: '0 8px',
      whiteSpace: 'nowrap',
      ...sx,
    }}
  />
);

const PlaceholderRow = React.memo(
  ({
    line,
    onChange,
  }: {
    line: DraftOutboundLine;
    onChange: (key: string, value: number, packSize: number) => void;
  }) => {
    const t = useTranslation('distribution');
    const { status } = useOutboundFields('status');
    const debouncedOnChange = useDebounceCallback(onChange, []);
    const [placeholderBuffer, setPlaceholderBuffer] = useState(
      line?.numberOfPacks ?? 0
    );

    return (
      <TableRow>
        <BasicCell align="right" sx={{ paddingTop: '3px' }}>
          {t('label.placeholder')}
        </BasicCell>
        <BasicCell sx={{ paddingTop: '3px' }}>
          <NumericTextInput
            onChange={event => {
              setPlaceholderBuffer(Number(event.target.value));
              debouncedOnChange(line.id, Number(event.target.value), 1);
            }}
            value={placeholderBuffer}
            disabled={status !== InvoiceNodeStatus.New}
          />
        </BasicCell>
      </TableRow>
    );
  }
);

export const OutboundLineEditTable: React.FC<OutboundLineEditTableProps> = ({
  onChange,
  packSizeController,
  rows,
}) => {
  const { orderedRows, placeholderRow } = useOutboundLineEditRows(
    rows,
    packSizeController
  );

  const columns = useColumns<DraftOutboundLine>(
    [
      [
        'numberOfPacks',
        {
          label: 'label.num-packs',
          Cell: NonNegativeNumberInputCell,
          setter: ({ packSize, id, numberOfPacks }) =>
            onChange(id, numberOfPacks ?? 0, packSize ?? 1),
        },
      ],
      ['packSize', { label: 'label.pack' }],
      [
        'unitQuantity',
        { accessor: ({ rowData }) => QuantityUtils.unitQuantity(rowData) },
      ],
      {
        key: 'availableNumberOfPacks',
        label: 'label.available',
        accessor: ({ rowData }) => rowData.stockLine?.availableNumberOfPacks,
        align: ColumnAlign.Right,
      },
      {
        key: 'sellPricePerPack',
        Cell: CurrencyCell,
        label: 'label.sell',
        accessor: ({ rowData }) => rowData.sellPricePerPack,
        width: 100,
        align: ColumnAlign.Right,
      },
      ['batch', { width: 75 }],

      {
        key: 'expiryDate',
        label: 'label.expiry',
        Cell: ExpiryDateCell,
        accessor: ({ rowData }) => rowData.expiryDate,
        width: 100,
      },
      {
        key: 'location',
        label: 'label.location',
        accessor: ({ rowData }) => rowData.location?.code ?? '',
        width: 80,
      },
      {
        key: 'onHold',
        label: 'label.on-hold',
        Cell: CheckCell,
        accessor: ({ rowData }) => rowData.stockLine?.onHold,
        width: 80,
        align: ColumnAlign.Center,
      },
    ],
    {},
    [onChange]
  );

  return (
    <>
      <Divider margin={10} />
      <DataTable dense columns={columns} data={orderedRows} />
      {placeholderRow ? (
        <PlaceholderRow line={placeholderRow} onChange={onChange} />
      ) : null}
    </>
  );
};
