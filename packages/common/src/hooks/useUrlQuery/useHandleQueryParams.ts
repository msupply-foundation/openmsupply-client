import { useUrlQuery } from './useUrlQuery';
import { Column } from '@openmsupply-client/common';

export const useHandleQueryParams = (sort: any) => {
  const { urlQuery, updateQuery } = useUrlQuery();
  const { onChangeSortBy, sortBy } = sort;

  const updateSortQuery = (column: any) => {
    const sort = column.key;
    const dir = column.sortBy.direction === 'asc' ? 'desc' : 'asc';
    updateQuery({ sort, dir });
  };

  const onChangeUrlQuery = (columns: any) => {
    const sortKey = urlQuery?.sort ?? 'otherPartyName';
    const column = columns.find(col => col.key === sortKey);
    console.log('column', column);
    if (
      column?.key !== sortBy.key ||
      column.sortBy?.direction !== urlQuery?.dir
    )
      onChangeSortBy(column as Column<T>);
  };

  return { urlQuery, updateSortQuery, onChangeUrlQuery };
};
