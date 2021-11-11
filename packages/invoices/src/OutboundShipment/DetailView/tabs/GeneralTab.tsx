import React, { FC } from 'react';
import {
  DataTable,
  ObjectWithStringKeys,
  usePagination,
  Column,
  DomainObject,
  Box,
} from '@openmsupply-client/common';
import { OutboundShipmentRow } from '../types';

interface GeneralTabProps<T extends ObjectWithStringKeys & DomainObject> {
  data: T[];
  columns: Column<T>[];
}

const Expand: FC = () => {
  return (
    <Box p={1} height={300}>
      <Box
        flex={1}
        display="flex"
        height="100%"
        borderRadius={4}
        bgcolor="#c7c9d933"
      />
    </Box>
  );
};

export const GeneralTabComponent: FC<GeneralTabProps<OutboundShipmentRow>> = ({
  data,
  columns,
}) => {
  const { pagination } = usePagination();
  const activeRows = data.filter(({ isDeleted }) => !isDeleted);

  return (
    <DataTable
      ExpandContent={Expand}
      pagination={{ ...pagination, total: activeRows.length }}
      columns={columns}
      data={activeRows.slice(
        pagination.offset,
        pagination.offset + pagination.first
      )}
      onChangePage={pagination.onChangePage}
      noDataMessageKey="error.no-items"
    />
  );
};

export const GeneralTab = React.memo(GeneralTabComponent);
