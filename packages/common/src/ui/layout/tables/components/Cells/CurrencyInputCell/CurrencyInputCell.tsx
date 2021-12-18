import React from 'react';
import { CellProps } from '../../../columns';
import { CurrencyInput } from '@common/components';
import { DomainObject } from '@common/types';
import { useBufferState, useDebounceCallback } from '@common/hooks';

type RowData<T> = T & DomainObject;

type DomainObjectWithUpdater<T> = RowData<T> & {
  update: (patch: Partial<RowData<T>>) => void;
};

type CellPropsWithUpdaterObject<T> = CellProps<DomainObjectWithUpdater<T>>;

export const CurrencyInputCell = <T extends DomainObject>({
  rowData,
  rows,
  column,
}: CellPropsWithUpdaterObject<T>): React.ReactElement<
  CellPropsWithUpdaterObject<T>
> => {
  const [buffer, setBuffer] = useBufferState(
    Number(column.accessor({ rowData, rows }))
  );

  const updater = useDebounceCallback(column.setter, [rowData], 250);

  return (
    <CurrencyInput
      maxWidth={column.width}
      value={buffer}
      onChangeNumber={newNumber => {
        setBuffer(newNumber);
        updater({ ...rowData, [column.key]: Number(newNumber) });
      }}
    />
  );
};
