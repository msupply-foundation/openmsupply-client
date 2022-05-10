import {
  useQuery,
  UseQueryResult,
  useParams,
} from '@openmsupply-client/common';
import { MasterListFragment } from '../../operations.generated';
import { useMasterListApi } from '../utils/useMasterListApi';

const useMasterListId = () => {
  const { id = '' } = useParams();
  return id;
};

export const useMasterList = (): UseQueryResult<MasterListFragment> => {
  const masterListId = useMasterListId();
  const api = useMasterListApi();
  return useQuery(
    api.keys.detail(masterListId),
    () => api.get.byId(masterListId),
    // Don't refetch when the edit modal opens, for example. But, don't cache data when this query
    // is inactive. For example, when navigating away from the page and back again, refetch.
    {
      refetchOnMount: false,
      cacheTime: 0,
    }
  );
};
