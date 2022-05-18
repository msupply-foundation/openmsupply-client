import { useHandleQueryParams } from './../../../../../../common/src/hooks/useUrlQuery/useHandleQueryParams';
import { useQuery } from '@openmsupply-client/common';
import { useOutboundApi } from './../utils/useOutboundApi';

export const useOutbounds = () => {
  const api = useOutboundApi();

  // Just use the global url state rather than the global query params store
  // don't need to sync them together
  const { queryParams } = useHandleQueryParams();

  return {
    ...useQuery(api.keys.paramList(queryParams), () =>
      api.get.list(queryParams)
    ),
    ...queryParams,
  };
};
