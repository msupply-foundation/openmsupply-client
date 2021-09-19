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

export const useSortBy = <T extends { sortable: true }>(
  initialSortColumn: Column<T>
): SortState<T> => {
  const [sortBy, setSortBy] = useState<SortRule<T>>(
    mapColumnIntoSortBy(initialSortColumn)
  );

  const onChangeSortBy = useCallback(
    (newSortColumn: Column<T>) => {
      const newSortBy = mapColumnIntoSortBy(newSortColumn);
      console.log('-------------------------------------------');
      console.log('newSortBy', newSortBy);
      console.log('newSortBy.key === sortBy.key', newSortBy.key === sortBy.key);
      console.log('-------------------------------------------');
      const newIsDesc =
        newSortBy.key === sortBy.key
          ? !sortBy.isDesc
          : getIsDesc(newSortColumn.defaultSortDirection ?? 'asc');
      const newDirection = getDirection(newIsDesc);

      setSortBy({ ...newSortBy, direction: newDirection, isDesc: newIsDesc });

      return newSortBy;
    },
    [sortBy]
  );

  return { sortBy, onChangeSortBy };
};
