import React from 'react';
import { Box, Typography } from '@mui/material';
import { DateUtils, Formatter } from '@common/utils';
import { RecordWithId } from '@common/types';
import { useTranslation } from '@common/intl';
import { InfoTooltipIcon } from '@common/components';
import { CellProps } from '../../../columns/types';

export const ExpiryDateCell = <T extends RecordWithId>({
  column,
  rowData,
  rows,
}: CellProps<T>) => {
  const t = useTranslation();
  const expiryDate = column.accessor({ rowData, rows }) as string;
  const isExpired = expiryDate
    ? DateUtils.isExpired(new Date(expiryDate))
    : false;

  return (
    <Box
      flexDirection="row"
      display="flex"
      flex={1}
      color={isExpired ? 'red' : 'inherit'}
    >
      <Typography
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'inherit',
        }}
      >
        {Formatter.expiryDateString(expiryDate)}
      </Typography>
      {isExpired ? (
        <InfoTooltipIcon title={t('messages.this-batch-has-expired')} />
      ) : null}
    </Box>
  );
};
