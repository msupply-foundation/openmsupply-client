import { FilterOptionsState, RegexUtils } from '@openmsupply-client/common';
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
