import React, { FC } from 'react';
import {
  AppBarContentPortal,
  SearchBar,
  FilterController,
} from '@openmsupply-client/common';
import { ResponseRequisitionRowFragment } from '../api';

export const Toolbar: FC<{
  filter: FilterController;
}> = ({ filter }) => {
  const key = 'comment' as keyof ResponseRequisitionRowFragment;
  const filterString = filter.filterBy?.[key]?.like as string;

  return (
    <AppBarContentPortal
      sx={{
        paddingBottom: '16px',
        flex: 1,
        justifyContent: 'space-between',
        display: 'flex',
      }}
    >
      <SearchBar
        placeholder="Search by comment..."
        value={filterString}
        onChange={newValue => {
          if (!newValue) return filter.onClearFilterRule('comment');
          return filter.onChangeStringFilterRule('comment', 'like', newValue);
        }}
      />
    </AppBarContentPortal>
  );
};
