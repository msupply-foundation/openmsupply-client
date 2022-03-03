import React, { FC } from 'react';
import {
  useToggle,
  useFormatNumber,
  useTranslation,
  styled,
  Autocomplete,
  defaultOptionMapper,
} from '@openmsupply-client/common';
import { useItemsWithStats } from '../../api';
import { ItemRowWithStatsFragment } from '../../api/operations.generated';

const ItemOption = styled('li')(({ theme }) => ({
  color: theme.palette.gray.main,
  backgroundColor: theme.palette.background.toolbar,
}));

const filterOptions = {
  stringify: (item: ItemRowWithStatsFragment) => `${item.code} ${item.name}`,
  limit: 100,
};

const getOptionRenderer =
  (label: string, formatNumber: (value: number) => string) =>
  (
    props: React.HTMLAttributes<HTMLLIElement>,
    item: ItemRowWithStatsFragment
  ) =>
    (
      <ItemOption {...props} key={item.code}>
        <span style={{ whiteSpace: 'nowrap', width: 100 }}>{item.code}</span>
        <span style={{ whiteSpace: 'nowrap', width: 500 }}>{item.name}</span>
        <span
          style={{
            width: 200,
            textAlign: 'right',
            whiteSpace: 'nowrap',
          }}
        >{`${formatNumber(item.stats.availableStockOnHand)} ${label}`}</span>
      </ItemOption>
    );

interface ItemSearchInputProps {
  onChange: (item: ItemRowWithStatsFragment | null) => void;
  currentItemId?: string | null;
  disabled?: boolean;
  extraFilter?: (item: ItemRowWithStatsFragment) => boolean;
  width?: number;
}

export const ItemSearchInput: FC<ItemSearchInputProps> = ({
  onChange,
  currentItemId,
  disabled = false,
  extraFilter,
  width = 850,
}) => {
  const { data, isLoading } = useItemsWithStats();
  const t = useTranslation('common');
  const formatNumber = useFormatNumber();

  const value = data?.nodes.find(({ id }) => id === currentItemId) ?? null;
  const selectControl = useToggle();

  const options = extraFilter
    ? data?.nodes?.filter(extraFilter) ?? []
    : data?.nodes ?? [];

  return (
    <Autocomplete
      disabled={disabled}
      onOpen={selectControl.toggleOn}
      onClose={selectControl.toggleOff}
      filterOptionConfig={filterOptions}
      loading={isLoading}
      value={value ? { ...value, label: value.name ?? '' } : null}
      noOptionsText={t('error.no-items')}
      onChange={(_, item) => onChange(item)}
      options={defaultOptionMapper(options, 'name')}
      getOptionLabel={option => `${option.code}     ${option.name}`}
      renderOption={getOptionRenderer(t('label.units'), formatNumber)}
      width={`${width}px`}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      autoWidthPopper
    />
  );
};
