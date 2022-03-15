import { useMemo } from 'react';
import {
  useQuery,
  useGql,
  useAuthContext,
  useQueryParams,
  UseQueryResult,
  useParams,
  SortUtils,
} from '@openmsupply-client/common';
import {
  getSdk,
  MasterListFragment,
  MasterListRowFragment,
} from './operations.generated';
import { getMasterListQueries, ListParams } from './api';
import { useMasterListColumns } from '../DetailView/columns';

export const useMasterListApi = () => {
  const { storeId } = useAuthContext();
  const keys = {
    base: () => ['master-list'] as const,
    detail: (id: string) => [...keys.base(), storeId, id] as const,
    list: () => [...keys.base(), storeId, 'list'] as const,
    paramList: (params: ListParams) => [...keys.list(), params] as const,
  };
  const { client } = useGql();
  const sdk = getSdk(client);
  const queries = getMasterListQueries(sdk, storeId);

  return { ...queries, storeId, keys };
};

export const useMasterLists = ({ enabled } = { enabled: true }) => {
  const queryParams = useQueryParams<MasterListRowFragment>({
    initialSortBy: { key: 'name' },
  });
  const api = useMasterListApi();

  return {
    ...useQuery(
      api.keys.paramList(queryParams),
      () =>
        api.get.list({
          first: queryParams.first,
          offset: queryParams.offset,
          sortBy: queryParams.sortBy,
          filterBy: queryParams.filter.filterBy,
        }),
      {
        enabled,
      }
    ),
    ...queryParams,
  };
};

const useMasterListId = () => {
  const { id = '' } = useParams();
  return id;
};

export const useMasterList = (): UseQueryResult<MasterListFragment> => {
  const masterListId = useMasterListId();
  const api = useMasterListApi();
  return useQuery(api.keys.detail(masterListId), () =>
    api.get.byId(masterListId)
  );
};

export const useMasterListFields = () => {
  const { data } = useMasterList();
  return { ...data };
};

export const useMasterListLines = () => {
  const { columns, onChangeSortBy, sortBy } = useMasterListColumns();
  const { lines } = useMasterListFields();

  const sorted = useMemo(() => {
    const currentColumn = columns.find(({ key }) => key === sortBy.key);
    const { getSortValue } = currentColumn ?? {};
    return getSortValue
      ? lines?.nodes.sort(
          SortUtils.getColumnSorter(getSortValue, !!sortBy.isDesc)
        )
      : lines?.nodes;
  }, [sortBy.key, sortBy.isDesc, lines]);

  return { lines: sorted, sortBy, onChangeSortBy, columns };
};
