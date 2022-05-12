import {
  useQuery,
  useQueryParamsStore,
  useUrlQuery,
} from '@openmsupply-client/common';
import { useOutboundApi } from './../utils/useOutboundApi';

export const useOutbounds = () => {
  const queryParams = useQueryParamsStore();
  const api = useOutboundApi();
  const { databaseParams } = useUrlQuery();

  // console.log('queryParams', queryParams.paramList());

  return {
    ...useQuery(api.keys.paramList(databaseParams), () =>
      api.get.list(databaseParams)
    ),
    ...queryParams,
  };
};
