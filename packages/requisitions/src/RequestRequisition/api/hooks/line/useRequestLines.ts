import { useEffect, useMemo } from 'react';
import { zustand, SortUtils, RegexUtils } from '@openmsupply-client/common';
import { useRequestColumns } from '../../../DetailView/columns';
import { useHideOverStocked } from '../index';
import { useRequestFields } from '../document/useRequestFields';

const useItemFilter = zustand<{
  itemFilter: string;
  setItemFilter: (itemFilter: string) => void;
}>(set => ({
  setItemFilter: (itemFilter: string) =>
    set(state => ({ ...state, itemFilter })),
  itemFilter: '',
}));

export const useRequestLines = () => {
  const { on } = useHideOverStocked();
  const { itemFilter, setItemFilter } = useItemFilter();
  const { columns, onChangeSortBy, sortBy } = useRequestColumns();
  const { lines, minMonthsOfStock } = useRequestFields([
    'lines',
    'minMonthsOfStock',
  ]);

  useEffect(() => {
    setItemFilter('');
  }, []);

  const sorted = useMemo(() => {
    const currentColumn = columns.find(({ key }) => key === sortBy.key);
    const { getSortValue } = currentColumn ?? {};
    const sorted = getSortValue
      ? lines?.nodes.sort(
          SortUtils.getColumnSorter(getSortValue, !!sortBy.isDesc)
        )
      : lines?.nodes;

    if (on) {
      return sorted.filter(
        item =>
          item.itemStats.availableStockOnHand <
            item.itemStats.averageMonthlyConsumption * minMonthsOfStock &&
          RegexUtils.includes(itemFilter, item.item.name)
      );
    } else {
      return sorted.filter(({ item: { name } }) =>
        RegexUtils.includes(itemFilter, name)
      );
    }
  }, [sortBy.key, sortBy.isDesc, lines, on, minMonthsOfStock, itemFilter]);

  return {
    lines: sorted,
    sortBy,
    onChangeSortBy,
    columns,
    itemFilter,
    setItemFilter,
  };
};
