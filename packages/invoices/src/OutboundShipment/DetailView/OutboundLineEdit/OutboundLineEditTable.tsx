import React, { useState } from 'react';
import {
  Divider,
  Box,
  DataTable,
  NonNegativeNumberInput,
  useTranslation,
  Typography,
  useDebounceCallback,
  InvoiceNodeStatus,
} from '@openmsupply-client/common';
import { DraftOutboundLine } from '../../../types';
import { PackSizeController, useOutboundLineEditRows } from './hooks';
import { useIsOutboundDisabled, useOutboundFields } from '../../api';
import { useOutboundLineEditColumns } from './columns';

export interface OutboundLineEditTableProps {
  onChange: (key: string, value: number, packSize: number) => void;
  packSizeController: PackSizeController;
  rows: DraftOutboundLine[];
}

const PlaceholderRow = ({
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
    <Box display="flex">
      <Typography
        style={{
          alignItems: 'center',
          display: 'flex',
          flex: '0 1 100px',
          fontSize: 12,
          justifyContent: 'flex-end',
          paddingRight: 8,
        }}
      >
        {t('label.placeholder')}
      </Typography>
      <Box sx={{ paddingTop: '3px' }}>
        <NonNegativeNumberInput
          onChange={value => {
            setPlaceholderBuffer(value);
            debouncedOnChange(line.id, value, 1);
          }}
          value={placeholderBuffer}
          disabled={status !== InvoiceNodeStatus.New}
        />
      </Box>
    </Box>
  );
};

export const OutboundLineEditTable: React.FC<OutboundLineEditTableProps> = ({
  onChange,
  packSizeController,
  rows,
}) => {
  // const { setDisabledRows } = useTableStore();

  const isDisabled = useIsOutboundDisabled();
  const columns = useOutboundLineEditColumns({ onChange });
  const { orderedRows, placeholderRow } = useOutboundLineEditRows(
    rows,
    packSizeController
  );

  return (
    <Box>
      <Divider margin={10} />
      <Box style={{ height: 390, overflowX: 'hidden', overflowY: 'scroll' }}>
        <DataTable
          isDisabled={isDisabled}
          columns={columns}
          data={orderedRows}
          dense
        />
        {placeholderRow ? (
          <PlaceholderRow line={placeholderRow} onChange={onChange} />
        ) : null}
      </Box>
    </Box>
  );
};
