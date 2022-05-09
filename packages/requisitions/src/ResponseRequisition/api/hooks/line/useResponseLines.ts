import { useMemo, useEffect } from 'react';
import {
  SortController,
  SortUtils,
  Column,
  RegexUtils,
  zustand,
} from '@openmsupply-client/common';
import { ResponseLineFragment } from '../../operations.generated';
import { useResponseColumns } from '../../../DetailView/columns';
import { useResponseFields } from '../document/useResponseFields';

interface UseResponseLinesController
  extends SortController<ResponseLineFragment> {
  lines: ResponseLineFragment[];
  columns: Column<ResponseLineFragment>[];
  itemFilter: string;
  setItemFilter: (itemFilter: string) => void;
}

const useItemFilter = zustand<{
  itemFilter: string;
  setItemFilter: (itemFilter: string) => void;
}>(set => ({
  setItemFilter: (itemFilter: string) =>
    set(state => ({ ...state, itemFilter })),
  itemFilter: '',
}));

export const useResponseLines = (): UseResponseLinesController => {
  const { lines } = useResponseFields('lines');
  const { columns, onChangeSortBy, sortBy } = useResponseColumns();
  const { itemFilter, setItemFilter } = useItemFilter();

  useEffect(() => {
    setItemFilter('');
  }, []);

  const sorted = useMemo(() => {
    const currentColumn = columns.find(({ key }) => key === sortBy.key);
    const { getSortValue } = currentColumn ?? {};
    const sortedLines = getSortValue
      ? lines?.nodes.sort(
          SortUtils.getColumnSorter(getSortValue, !!sortBy.isDesc)
        )
      : lines?.nodes;
    return sortedLines.filter(({ item: { name } }) =>
      RegexUtils.includes(itemFilter, name)
    );
  }, [sortBy.key, sortBy.isDesc, lines, itemFilter]);

  return {
    lines: sorted,
    sortBy,
    onChangeSortBy,
    columns,
    itemFilter,
    setItemFilter,
  };
};
