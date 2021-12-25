import React, { FC } from 'react';
import { Box, TableCell, TableRow, TableSortLabel } from '@mui/material';
import { Column } from '../../columns/types';
import { MenuDotsIcon, SortDescIcon } from '@common/icons';
import { DomainObject } from '@common/types';
import { useDebounceCallback } from '@common/hooks';

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

interface HeaderCellProps<T extends DomainObject> {
  column: Column<T>;
  dense?: boolean;
}

export const HeaderCell = <T extends DomainObject>({
  column,
  dense = false,
}: HeaderCellProps<T>): JSX.Element => {
  const {
    minWidth,
    width,
    onChangeSortBy,
    key,
    sortable,
    align,
    sortBy,
    Header,
  } = column;

  const [x, setX] = React.useState(0);

  const { direction, key: currentSortKey } = sortBy ?? {};

  const isSorted = key === currentSortKey;

  const onSort = useDebounceCallback(
    () => onChangeSortBy && sortable && onChangeSortBy(column),
    [column],
    150
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
        width: width + 10,
        minWidth: minWidth + 10,
        flex: `${width} 0 auto`,
        fontWeight: 'bold',
        fontSize: dense ? '12px' : '14px',
      }}
      aria-label={String(key)}
      sortDirection={isSorted ? direction : false}
    >
      {sortable ? (
        <Box
          flexDirection="row"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <TableSortLabel
            hideSortIcon={false}
            active={isSorted}
            direction={direction}
            IconComponent={SortDescIcon}
          >
            <Header column={column} />
          </TableSortLabel>

          {column?.onChangeWidth && (
            <Box
              sx={{
                cursor: 'col-resize',
                backgroundColor: 'transparent',
              }}
              draggable
              onDragStart={e => {
                setX(e.clientX);
              }}
              onDragEnd={e => {
                column?.onChangeWidth &&
                  column.onChangeWidth(
                    Math.max(column.width + (e.clientX - x), column.minWidth)
                  );

                setX(e.clientX);
              }}
            >
              <MenuDotsIcon />
            </Box>
          )}
        </Box>
      ) : (
        <Header column={column} />
      )}
    </TableCell>
  );
};

<div />;
