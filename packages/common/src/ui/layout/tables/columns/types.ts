import { JSXElementConstructor } from 'react';
import { SortBy } from '../../../../hooks';
import { LocaleKey } from './../../../../intl/intlHelpers';
import { DomainObject } from './../../../../types';

export interface CellProps<T extends DomainObject> {
  rowData: T;
  columns: Column<T>[];
  column: Column<T>;
  rowKey: string;
}

export interface HeaderProps<T extends DomainObject> {
  column: Column<T>;
}

export enum ColumnFormat {
  Date,
  Integer,
  Real,
  Text,
}

export enum ColumnAlign {
  Left = 'left',
  Right = 'right',
  Center = 'center',
}

export type ColumnDataAccessor<T extends DomainObject> = (
  rowData: T
) => unknown;

export type ColumnDataFormatter = (rowDataValue: unknown) => string;

export enum GenericColumnKey {
  Selection = 'selection',
}

export interface Column<T extends DomainObject> {
  key: keyof T | GenericColumnKey;
  accessor: ColumnDataAccessor<T>;

  label: LocaleKey | '';

  format: ColumnFormat;
  align: ColumnAlign;

  sortable: boolean;
  sortDescFirst: boolean;
  sortType: 'datetime' | 'numeric' | 'alphanumeric';
  sortInverted: boolean;
  onChangeSortBy?: (column: Column<T>) => void;
  sortBy?: SortBy<T>;

  width: number;
  minWidth: number;

  order?: number;

  Cell: JSXElementConstructor<CellProps<T>>;
  Header: JSXElementConstructor<HeaderProps<T>>;

  formatter: ColumnDataFormatter;
}

export interface ColumnDefinition<T extends DomainObject>
  extends Partial<Omit<Column<T>, 'key'>> {
  key: keyof T | GenericColumnKey;
}
