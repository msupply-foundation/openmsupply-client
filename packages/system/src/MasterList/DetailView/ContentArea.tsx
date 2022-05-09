import React from 'react';
import { DataTable, useTranslation } from '@openmsupply-client/common';
import { useMasterList } from '../api';

export const ContentArea = () => {
  const t = useTranslation('common');
  const { lines, columns } = useMasterList.line.rows();
  return (
    <DataTable
      columns={columns}
      data={lines}
      noDataMessage={t('error.no-items')}
    />
  );
};
