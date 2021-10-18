import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export const ArrowLeftIcon = (props: SvgIconProps): JSX.Element => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M9.293 5.293c.39-.39 1.024-.39 1.414 0 .39.39.39 1.024 0 1.414L6.414 11H20c.513 0 .936.386.993.883L21 12c0 .552-.448 1-1 1H6.414l4.293 4.293c.36.36.388.928.083 1.32l-.083.094c-.39.39-1.024.39-1.414 0l-6-6-.073-.082-.007-.008-.017-.022c-.018-.024-.034-.049-.05-.074l-.021-.037c-.011-.02-.022-.04-.031-.06l-.023-.053-.021-.06-.014-.045-.016-.065-.009-.053C3.004 12.1 3 12.051 3 12l.004.09L3 12.02V12v-.02c0-.022.002-.046.004-.07l.007-.059.01-.052c.004-.022.009-.043.015-.065l.014-.046.021-.06.023-.051.03-.061.022-.037c.016-.025.032-.05.05-.074.03-.04.061-.077.097-.112l-.08.09c.025-.031.051-.062.08-.09z" />
    </SvgIcon>
  );
};
