import { useUrlQuery } from './useUrlQuery';
import { Column, SortController } from '@openmsupply-client/common';
import { FilterController, PaginationController } from '../useQueryParams';

export const useHandleQueryParams = ({
  sort,
  pagination,
  filterKey,
}: {
  sort: SortController<any>;
  pagination: PaginationController;
  filterKey: string;
}) => {
  const { urlQuery, updateQuery } = useUrlQuery();
  const { onChangeSortBy, sortBy } = sort;
  const { onChangePage, page } = pagination;

  const updateSortQuery = (column: Column<any>) => {
    const currentSort = urlQuery?.['sort'];
    const sort = column.key as string;
    if (sort !== currentSort) {
      updateQuery({ sort, dir: 'asc', page: 1 });
    } else {
      const dir = column?.sortBy?.direction === 'asc' ? 'desc' : 'asc';
      updateQuery({ dir });
    }
  };

  const updatePaginationQuery = (page: number) => {
    // Page is zero-indexed in useQueryParams store, so increase it by one
    updateQuery({ page: page + 1 });
  };

  const updateFilterQuery = (key: string, value: string) => {
    updateQuery({ [key]: value });
  };

  const onChangeUrlQuery = (
    columns: Column<any>[],
    filter: FilterController
  ) => {
    // Update Sort
    if (urlQuery?.['sort'] || urlQuery?.['dir']) {
      const sortKey = urlQuery?.['sort'] ?? 'otherPartyName';
      const column = columns.find(col => col.key === sortKey);
      if (
        column?.key !== sortBy.key ||
        column.sortBy?.direction !== urlQuery?.['dir']
      )
        onChangeSortBy(column as Column<any>);
    }

    // Update Pagination
    const urlPage = urlQuery?.['page'] ? (urlQuery?.['page'] as number) - 1 : 0;
    if (urlPage !== page) onChangePage(urlPage);

    // Update Filter
    if (urlQuery?.[filterKey])
      filter.onChangeStringFilterRule(
        filterKey,
        'like',
        urlQuery[filterKey] as string
      );
    else filter.onClearFilterRule(filterKey);
  };

  return {
    urlQuery,
    updateSortQuery,
    updatePaginationQuery,
    updateFilterQuery,
    onChangeUrlQuery,
  };
};
