import { useEffect, useState } from 'react';
import { useTranslation } from '@common/intl';

export const usePageTitle = (title: string) => {
  const t = useTranslation('common');
  const [pageTitle, setPageTitle] = useState(title);

  useEffect(() => {
    const newTitle = `${title} | ${t('app')}`;
    setPageTitle(newTitle);
    document.title = newTitle;
  }, [title]);

  return { pageTitle, setPageTitle };
};
