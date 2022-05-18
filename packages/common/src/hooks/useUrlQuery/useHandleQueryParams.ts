import { useUrlQuery } from './useUrlQuery';
import { Column } from '@openmsupply-client/common';

// You could make this just 'useQueryParams' and use
// some sort of parameter to use either a global queryParams
// store or the url, but you don't need both.
// using the global store can be used for say, a table in a modal
// (a secondary table using sorting/filtering etc)
export const useHandleQueryParams = () => {
  const { urlQuery, updateQuery } = useUrlQuery();

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

  // Make a query params object with the same(ish) shape from the url params
  // don't need to memoise or store in state or anything
  const queryParams = {
    page: urlQuery.page,
    offset: 0,
    first: 20,
    sortBy: {
      key: urlQuery.sort,
      direction: urlQuery.dir,
      isDesc: urlQuery.dir === 'desc',
    },
    // :shrug I didn't want to do this
    filterBy: {},
  };

  return {
    queryParams,
    urlQuery,
    updateSortQuery,
    updatePaginationQuery,
    updateFilterQuery,
  };
};
