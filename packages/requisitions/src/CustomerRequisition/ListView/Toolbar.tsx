import React, { FC, useEffect, useRef } from 'react';
import {
  useNotification,
  DropdownMenu,
  DropdownMenuItem,
  useTranslation,
  DeleteIcon,
  useTableStore,
  AppBarContentPortal,
  SearchBar,
  FilterController,
} from '@openmsupply-client/common';
import { RequisitionRow } from '../../types';

export const Toolbar: FC<{
  onDelete: (toDelete: RequisitionRow[]) => void;
  filter: FilterController;
  data?: RequisitionRow[];
}> = ({ onDelete, data, filter }) => {
  const t = useTranslation('distribution');

  const { success, info } = useNotification();

  const { selectedRows } = useTableStore(state => ({
    selectedRows: Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean) as RequisitionRow[],
  }));

  const deleteAction = () => {
    if (selectedRows && selectedRows?.length > 0) {
      onDelete(selectedRows);
      success(`Deleted ${selectedRows?.length} invoices`)();
    } else {
      info('Select rows to delete them')();
    }
  };

  const ref = useRef(deleteAction);

  useEffect(() => {
    ref.current = deleteAction;
  }, [selectedRows]);

  const key = 'comment' as keyof RequisitionRow;
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
          filter.onChangeStringFilterRule('comment', 'like', newValue);
        }}
      />

      <DropdownMenu label="Select">
        <DropdownMenuItem IconComponent={DeleteIcon} onClick={deleteAction}>
          {t('button.delete-lines')}
        </DropdownMenuItem>
      </DropdownMenu>
    </AppBarContentPortal>
  );
};
