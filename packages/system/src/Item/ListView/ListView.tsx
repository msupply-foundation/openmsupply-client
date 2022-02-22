import React, { FC } from 'react';
import {
  useNavigate,
  TableProvider,
  DataTable,
  useColumns,
  createTableStore,
} from '@openmsupply-client/common';
import { useItemListView, ItemRowFragment } from '../api';

export const ItemListView: FC = () => {
  const { data, isLoading, onChangePage, pagination, sortBy, onChangeSortBy } =
    useItemListView();
  const navigate = useNavigate();

  const columns = useColumns<ItemRowFragment>(
    ['name', 'code'],
    {
      sortBy,
      onChangeSortBy,
    },
    [sortBy]
  );

  return (
    <TableProvider createStore={createTableStore}>
      <DataTable
        pagination={{ ...pagination, total: data?.totalCount }}
        onChangePage={onChangePage}
        columns={columns}
        data={data?.nodes}
        isLoading={isLoading}
        onRowClick={row => {
          navigate(`/catalogue/items/${row.id}`);
        }}
      />
    </TableProvider>
  );
};
