import React, { FC } from 'react';
import { TableCell, TableRow, TableSortLabel, Tooltip } from '@mui/material';
import { Column } from '../../columns/types';
import { SortDescIcon } from '@common/icons';
import { RecordWithId } from '@common/types';
import { useDebounceCallback } from '@common/hooks';
import { useTranslation } from '@common/intl';

export const HeaderRow: FC<{ dense?: boolean }> = ({ dense, ...props }) => (
  <TableRow
    {...props}
    sx={{
      display: 'flex',
      flex: '1 0 auto',
      height: !!dense ? '40px' : '60px',
      alignItems: 'center',
    }}
  />
);

interface HeaderCellProps<T extends RecordWithId> {
  column: Column<T>;
  dense?: boolean;
}

export const HeaderCell = <T extends RecordWithId>({
  column,
  dense = false,
}: HeaderCellProps<T>): JSX.Element => {
  const {
    maxWidth,
    minWidth,
    width,
    onChangeSortBy,
    key,
    sortable,
    align,
    sortBy,
    Header,
    description,
  } = column;

  const { direction, key: currentSortKey } = sortBy ?? {};
  const t = useTranslation('common');
  const isSorted = key === currentSortKey;

  const onSort = useDebounceCallback(
    () => onChangeSortBy && sortable && onChangeSortBy(column),
    [column],
    150
  );

  const tooltip = (
    <>
      {!!description && <div>{t(description)}</div>}
      {sortable && <div>{t('label.click-to-sort')}</div>}
    </>
  );
  return (
    <TableCell
      role="columnheader"
      onClick={onSort}
      align={align}
      padding={'none'}
      sx={{
        backgroundColor: 'transparent',
        borderBottom: '0px',
        paddingLeft: '16px',
        paddingRight: '16px',
        width,
        minWidth,
        maxWidth,
        flex: `${width} 0 auto`,
        fontWeight: 'bold',
        fontSize: dense ? '12px' : '14px',
      }}
      aria-label={String(key)}
      sortDirection={isSorted ? direction : false}
    >
      <Tooltip
        title={tooltip}
        placement="bottom"
        style={{ whiteSpace: 'pre-line' }}
      >
        {sortable ? (
          <TableSortLabel
            hideSortIcon={false}
            active={isSorted}
            direction={direction}
            IconComponent={SortDescIcon}
          >
            <Header column={column} />
          </TableSortLabel>
        ) : (
          <Header column={column} />
        )}
      </Tooltip>
    </TableCell>
  );
};
