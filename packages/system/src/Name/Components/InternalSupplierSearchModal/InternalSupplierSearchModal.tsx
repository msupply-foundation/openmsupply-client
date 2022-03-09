import React, { FC } from 'react';
import { ListSearch, useTranslation } from '@openmsupply-client/common';
import { useInternalSuppliers, NameRowFragment } from '../../api';
import { NameSearchProps } from '../../utils';

export const InternalSupplierSearchModal: FC<NameSearchProps> = ({
  open,
  onClose,
  onChange,
}) => {
  const { data, isLoading } = useInternalSuppliers();
  const t = useTranslation(['app', 'common']);

  return (
    <ListSearch
      loading={isLoading}
      open={open}
      options={data?.nodes ?? []}
      onClose={onClose}
      title={t('suppliers')}
      optionKey="name"
      onChange={(_, name: NameRowFragment | null) => {
        if (name) onChange(name);
      }}
    />
  );
};
