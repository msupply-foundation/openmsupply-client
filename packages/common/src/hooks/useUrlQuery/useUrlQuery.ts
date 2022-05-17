import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UrlQueryObject {
  [key: string]: string | number | boolean;
}

export const useUrlQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [urlQuery, setUrlQuery] = useState<UrlQueryObject>({});

  useEffect(() => {
    setUrlQuery(parseSearchParams(searchParams));
  }, [searchParams]);

  const updateQuery = (values: UrlQueryObject, overwrite = false) => {
    if (overwrite) setSearchParams(createValidQueryObject(values));
    else
      setSearchParams({
        ...urlQuery,
        ...createValidQueryObject(values),
      });
  };

  return { urlQuery, updateQuery };
};

// Stringifies all values and removes empty keys
const createValidQueryObject = (obj: UrlQueryObject) => {
  const validEntries = Object.entries(obj)
    .filter(([_, value]) => value)
    .map(([key, value]) => [key, String(value)]);

  return Object.fromEntries(validEntries);
};

// Coerces url params to appropriate type
const parseSearchParams = (searchParams: URLSearchParams) =>
  Object.fromEntries(
    Array.from(searchParams.entries()).map(([key, value]) => {
      if (!isNaN(Number(value))) return [key, Number(value)];
      if (value === 'true') return [key, true];
      if (value === 'false') return [key, false];
      return [key, value];
    })
  );
