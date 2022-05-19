import {
  FilterOptionsState,
  Formatter,
  LocaleKey,
  RegexUtils,
  TypedTFunction,
} from '@openmsupply-client/common';
import { NameRowFragment } from './api';

export interface NameSearchProps {
  open: boolean;
  onClose: () => void;
  onChange: (name: NameRowFragment) => void;
}

export interface NameSearchInputProps {
  onChange: (name: NameRowFragment) => void;
  width?: number;
  value: NameRowFragment | null;
  disabled?: boolean;
}

export const basicFilterOptions = {
  stringify: (name: NameRowFragment) => `${name.code} ${name.name}`,
  limit: 100,
};

export const filterByNameAndCode = (
  options: NameRowFragment[],
  state: FilterOptionsState<NameRowFragment>
) =>
  options.filter(option =>
    RegexUtils.matchObjectProperties(state.inputValue, option, ['name', 'code'])
  );

export const patientsToCsv = (
  invoices: NameRowFragment[],
  t: TypedTFunction<LocaleKey>
) => {
  const fields: string[] = [
    'id',
    t('label.name'),
    t('label.status'),
    t('label.invoice-number'),
    t('label.entered'),
    t('label.confirmed'),
    t('label.comment'),
    t('label.total'),
  ];

  const data = invoices.map(node => [
    node.id,
    node.code,
    node.name,
    node.isOnHold ? t('label.on-hold') : '',
  ]);
  return Formatter.csv({ fields, data });
};
