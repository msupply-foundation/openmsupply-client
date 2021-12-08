import React, { FC, useState, useEffect } from 'react';
import { StocktakeController, StocktakeItem } from '../../../../types';
import { ModalMode } from '../../DetailView';
import { StocktakeLineEditForm } from './StocktakeLineEditForm';
import {
  TableProvider,
  createTableStore,
  useTableStore,
  Typography,
  Slide,
  Divider,
  TableContainer,
  TabContext,
  TabList,
  Tab,
  alpha,
  TabPanel,
  styled,
  useTranslation,
  useIsMediumScreen,
  ButtonWithIcon,
  PlusCircleIcon,
  Box,
  CheckIcon,
  StockLine,
} from '@openmsupply-client/common';
import { StocktakeLineAddBatch } from './StocktakeLineAddBatch';
import { BatchTable, PricingTable } from './StocktakeLineEditTables';
import { createStocktakeRow, wrapStocktakeItem } from './utils';
import { useStockLines } from '../../../../../../system/src';

interface StocktakeLineEditProps {
  item: StocktakeItem | null;
  onChangeItem: (item: StocktakeItem | null) => void;
  mode: ModalMode;
  draft: StocktakeController;
}

const StyledTabPanel = styled(TabPanel)({
  height: '100%',
});

enum Tabs {
  Batch = 'Batch',
  Pricing = 'Pricing',
}

export const StocktakeLineEdit: FC<StocktakeLineEditProps> = ({
  item,
  draft,
  onChangeItem,
  mode,
}) => {
  const [currentTab, setCurrentTab] = React.useState<Tabs>(Tabs.Batch);
  const isMediumScreen = useIsMediumScreen();
  const t = useTranslation(['common', 'inventory']);

  const [wrappedStocktakeItem, setWrappedStocktakeItem] =
    useState<StocktakeItem | null>(null);

  useEffect(() => {
    setWrappedStocktakeItem(
      item ? wrapStocktakeItem(item, setWrappedStocktakeItem) : null
    );
  }, [item, setWrappedStocktakeItem]);

  const batches = wrappedStocktakeItem ? wrappedStocktakeItem.lines : [];

  const onAddBatch = (stockLineId = '') => {
    if (wrappedStocktakeItem) {
      wrappedStocktakeItem.upsertLine?.(
        createStocktakeRow(wrappedStocktakeItem, stockLineId)
      );
    }
  };

  const onConfirm = (ids: string[]) => {
    if (wrappedStocktakeItem) {
      const toCreate = ids.filter(
        id =>
          wrappedStocktakeItem.lines.find(l => l.stockLineId === id) ===
          undefined
      );

      const created = toCreate.map(id => {
        return createStocktakeRow(wrappedStocktakeItem, id);
      });

      const toDelete = wrappedStocktakeItem.lines
        .filter(({ id, stockLineId }) => {
          if (stockLineId) {
            return !ids.includes(stockLineId);
          } else {
            return !ids.includes(id);
          }
        })
        .map(({ id }) => id);

      const deleted = wrappedStocktakeItem.lines.filter(
        ({ id }) => !toDelete.includes(id)
      );

      wrappedStocktakeItem.lines = [...deleted, ...created];
      setWrappedStocktakeItem(wrappedStocktakeItem);
    }
  };

  const [slideIn, setSlideIn] = React.useState(false);

  const { data } = useStockLines(item?.itemCode());

  return (
    <Box position="relative" overflow="hidden">
      <StocktakeLineEditForm
        item={item}
        onChangeItem={onChangeItem}
        mode={mode}
        draft={draft}
      />
      <Divider margin={5} />
      {item ? (
        <TabContext value={currentTab}>
          <Box flex={1} display="flex" justifyContent="space-between">
            <Box flex={1} />
            <Box flex={1}>
              <TabList
                value={currentTab}
                centered
                onChange={(_, v) => setCurrentTab(v)}
              >
                <Tab value={Tabs.Batch} label={Tabs.Batch} />
                <Tab value={Tabs.Pricing} label={Tabs.Pricing} />
              </TabList>
            </Box>
            <Box flex={1} justifyContent="flex-end" display="flex">
              <ButtonWithIcon
                color="primary"
                variant="outlined"
                onClick={() => setSlideIn(true)}
                label={t('label.add-batch', { ns: 'inventory' })}
                Icon={<PlusCircleIcon />}
              />
            </Box>
          </Box>

          <TableContainer
            sx={{
              height: isMediumScreen ? 300 : 400,
              marginTop: 2,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'divider',
              borderRadius: '20px',
            }}
          >
            <Box
              sx={{
                width: 400,
                height: isMediumScreen ? 300 : 400,
                backgroundColor: theme =>
                  alpha(theme.palette['background']['menu'], 0.4),
                position: 'absolute',
                borderRadius: '20px',
              }}
            />

            <StyledTabPanel value={Tabs.Batch}>
              <BatchTable batches={batches} />
            </StyledTabPanel>

            <StyledTabPanel value={Tabs.Pricing}>
              <PricingTable batches={batches} />
            </StyledTabPanel>
          </TableContainer>
        </TabContext>
      ) : (
        <Box sx={{ height: isMediumScreen ? 400 : 500 }} />
      )}

      <TableProvider createStore={createTableStore}>
        <Slide in={slideIn} direction="up" mountOnEnter unmountOnExit>
          <StocktakeLineAddBatch
            item={item}
            lines={data}
            draft={draft}
            mode={mode}
            onConfirm={(ids: string[]) => {
              console.log('-------------------------------------------');
              console.log('ids', ids);
              console.log('-------------------------------------------');
              setSlideIn(false);
              onConfirm(ids);
            }}
          />
        </Slide>
      </TableProvider>
    </Box>
  );
};
