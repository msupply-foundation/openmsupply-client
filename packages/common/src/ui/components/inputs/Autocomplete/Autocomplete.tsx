import React, { PropsWithChildren } from 'react';
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteRenderInputParams,
  createFilterOptions,
  CreateFilterOptionsConfig,
} from '@mui/material';
import { BasicTextInput } from '../TextInput';
import { AutocompleteOnChange, AutocompleteOptionRenderer } from '.';

export interface AutocompleteProps<T> {
  filterOptionConfig?: CreateFilterOptionsConfig<T>;
  loading?: boolean;
  loadingText?: React.ReactNode;
  noOptionsText?: React.ReactNode;
  onChange?: AutocompleteOnChange<T>;
  options: readonly T[];
  width?: number;
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  renderOption?: AutocompleteOptionRenderer<T>;
}

export function Autocomplete<T>({
  filterOptionConfig,
  loading,
  loadingText,
  noOptionsText,
  onChange,
  options,
  renderInput,
  renderOption,
  width,
}: PropsWithChildren<AutocompleteProps<T>>): JSX.Element {
  const filterOptions = createFilterOptions(filterOptionConfig);

  const defaultRenderInput = (props: AutocompleteRenderInputParams) => (
    <BasicTextInput {...props} />
  );

  return (
    <MuiAutocomplete<T>
      fullWidth={false}
      sx={{
        '& .MuiAutocomplete-inputRoot': {
          width: width ? `${width}px` : 'auto',
        },
      }}
      filterOptions={filterOptions}
      loading={loading}
      loadingText={loadingText}
      noOptionsText={noOptionsText}
      options={options}
      size="small"
      renderInput={renderInput || defaultRenderInput}
      renderOption={renderOption}
      onChange={onChange}
    />
  );
}