import { useSearchParams } from 'react-router-dom';

export const useUrlQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = parseSearchParams(searchParams);

  const updateQuery = (values: { [key: string]: any }, overwrite = false) => {
    if (overwrite) setSearchParams(createValidQueryObject(values));
    else setSearchParams({ ...urlQuery, ...createValidQueryObject(values) });
  };

  return {
    urlQuery,
    updateQuery,
    databaseParams: {
      filterBy: null,
      first: 20,
      offset: 0,
      sortBy: {
        key: urlQuery?.sort || 'otherPartyName',
        direction: urlQuery?.dir || 'asc',
        isDesc: urlQuery?.dir !== 'asc',
      },
    },
  };
};

// Stringifies all values and removes empty keys
const createValidQueryObject = (obj: { [key: string]: any }) => {
  const validEntries = Object.entries(obj)
    .filter(([_, value]) => value)
    .map(([key, value]) => [key, String(value)]);

  return Object.fromEntries(validEntries);
};

// Coerces url params to appropriate type
const parseSearchParams = (searchParams: URLSearchParams) => {
  return Object.fromEntries(
    Array.from(searchParams.entries()).map(([key, value]) => {
      if (!isNaN(Number(value))) return [key, Number(value)];
      if (value === 'true') return [key, true];
      if (value === 'false') return [key, false];
      return [key, value];
    })
  );
};
