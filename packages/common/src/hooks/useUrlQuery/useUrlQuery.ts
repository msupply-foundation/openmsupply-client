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
    const newQueryObject = overwrite ? {} : { ...urlQuery };
    Object.entries(values).forEach(([key, value]) => {
      if (!value) delete newQueryObject[key];
      else newQueryObject[key] = value;
    });
    console.log('newQueryObject', newQueryObject);
    setSearchParams(newQueryObject);
  };

  return { urlQuery, updateQuery };
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
