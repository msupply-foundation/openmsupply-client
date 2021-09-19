/* eslint-disable @typescript-eslint/ban-types */
import { Column } from 'react-table';
import { useCallback, useState } from 'react';

export interface SortRule<T> {
  key: keyof T;
  isDesc: boolean;
  direction: 'asc' | 'desc';
}

export interface SortState<T extends object> {
  sortBy: SortRule<T>;
  onChangeSortBy: (newSortColumn: Column<T>) => void;
}

const getDirection = (isDesc: boolean) => (isDesc ? 'desc' : 'asc');

const getIsDesc = (direction: 'asc' | 'desc') => direction === 'desc';

const mapColumnIntoSortBy = <T extends object>(column: Column<T>) => ({
  key: column.id as keyof T,
  isDesc: getIsDesc(column.defaultSortDirection ?? 'asc'),
  direction: column.defaultSortDirection ?? 'asc',
});

export const useSortBy = <T extends object>(
  initialSortColumn: Column<T> & { sortable: true }
): SortState<T> => {
  const [sortBy, setSortBy] = useState<SortRule<T>>(
    mapColumnIntoSortBy(initialSortColumn)
  );

  const onChangeSortBy = useCallback(
    (newSortColumn: Column<T>) => {
      let newSortBy = sortBy;
      setSortBy(currentSortBy => {
        const columnAsSortBy = mapColumnIntoSortBy(newSortColumn);

        const newIsDesc =
          columnAsSortBy.key === currentSortBy.key
            ? !currentSortBy.isDesc
            : getIsDesc(newSortColumn.defaultSortDirection ?? 'asc');
        const newDirection = getDirection(newIsDesc);

        newSortBy = {
          ...columnAsSortBy,
          isDesc: newIsDesc,
          direction: newDirection,
        };
        return newSortBy;
      });

      return newSortBy;
    },
    [sortBy]
  );

  return { sortBy, onChangeSortBy };
};
