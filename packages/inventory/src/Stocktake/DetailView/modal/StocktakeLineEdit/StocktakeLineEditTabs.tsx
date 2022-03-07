import React, { FC, useState } from 'react';
import {
  TabContext,
  TabList,
  Tab,
  Box,
  ButtonWithIcon,
  PlusCircleIcon,
  useTranslation,
  styled,
  TabPanel,
} from '@openmsupply-client/common';

export enum Tabs {
  Batch = 'Batch',
  Pricing = 'Pricing',
}

export const StyledTabPanel = styled(TabPanel)({
  height: '100%',
});

export const StyledTabContainer = styled(Box)(() => ({
  height: 300,
  flexDirection: 'row',
  display: 'flex',
}));

export const StocktakeLineEditTabs: FC<{
  onAddLine: () => void;
  isDisabled: boolean;
}> = ({ children, onAddLine, isDisabled }) => {
  const t = useTranslation('inventory');
  const [currentTab, setCurrentTab] = useState(Tabs.Batch);

  return (
    <TabContext value={currentTab}>
      <Box flex={1} display="flex" justifyContent="space-between">
        <Box flex={1} />

        <TabList
          value={currentTab}
          centered
          onChange={(_, v) => setCurrentTab(v)}
        >
          <Tab value={Tabs.Batch} label={Tabs.Batch} />
          <Tab value={Tabs.Pricing} label={Tabs.Pricing} />
        </TabList>
        <Box flex={1} justifyContent="flex-end" display="flex">
          <ButtonWithIcon
            disabled={isDisabled}
            color="primary"
            variant="outlined"
            onClick={onAddLine}
            label={t('label.add-batch', { ns: 'inventory' })}
            Icon={<PlusCircleIcon />}
          />
        </Box>
      </Box>
      {children}
    </TabContext>
  );
};
