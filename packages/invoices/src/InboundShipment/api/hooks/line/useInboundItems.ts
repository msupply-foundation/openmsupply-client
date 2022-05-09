import { isA } from './../../../../utils';
import {
  InboundFragment,
  InboundLineFragment,
} from '../../operations.generated';
import { useInboundSelector } from './index';
import { useQueryParamsStore } from '@common/hooks';
import { InboundItem } from './../../../../types';
import { inboundLinesToSummaryItems } from './../../../../utils';
import { SortUtils } from '@common/utils';

export const useInboundItems = () => {
  const { sort } = useQueryParamsStore();
  const { sortBy, onChangeSortBy } = sort;
  const selectItems = (invoice: InboundFragment) =>
    inboundLinesToSummaryItems(
      invoice.lines.nodes.filter(line => isA.stockInLine(line))
    )
      .map(item => ({
        ...item,
        [String(sortBy.key)]:
          item.lines[0]?.[sortBy.key as keyof InboundLineFragment],
      }))
      .sort(
        SortUtils.getDataSorter(
          sortBy.key as keyof InboundItem,
          !!sortBy.isDesc
        )
      );

  const { data } = useInboundSelector(selectItems);

  return { data, sortBy, onSort: onChangeSortBy };
};
