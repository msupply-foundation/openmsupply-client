import React, { FC, forwardRef, useState, useEffect } from 'react';
import {
  Box,
  Fab,
  Typography,
  useTableStore,
  StockLine,
  DataTable,
  useColumns,
  PlusCircleIcon,
  ButtonWithIcon,
  getLineLabelColumn,
  generateUUID,
} from '@openmsupply-client/common';
import { StocktakeItem, StocktakeController } from '../../../../types';
import { ModalMode } from '../../DetailView';

interface StocktakeLineEditProps {
  lines: StockLine[];
  mode: ModalMode;
  item: StocktakeItem;
  draft: StocktakeController;
  onConfirm: (ids: string[]) => void;
}

const createStockLine = (itemId: string): StockLine => ({
  id: generateUUID(),
  availableNumberOfPacks: 9999,
  totalNumberOfPacks: 9999,
  storeId: '',
  onHold: false,
  costPricePerPack: 99999,
  sellPricePerPack: 9999,
  itemId,
  packSize: 1,
});

export const StocktakeLineAddBatch: FC<StocktakeLineEditProps> = forwardRef(
  ({ onConfirm, lines, item }, ref) => {
    const columns = useColumns<StockLine>([
      getLineLabelColumn(),
      'batch',
      'expiryDate',
      [
        'numberOfPacks',
        { accessor: ({ availableNumberOfPacks }) => availableNumberOfPacks },
      ],
      'packSize',
      'selection',
    ]);

    const { selectedRows } = useTableStore(state => ({
      selectedRows: Object.keys(state.rowState)
        .filter(id => {
          return state.rowState[id]?.isSelected ? id : false;
        })
        .filter(Boolean),
    }));

    const [data, setData] = useState(lines);

    useEffect(() => {
      setData(lines);
    }, [lines]);

    const onAddBatch = () => {
      setData(state => [...state, createStockLine(item.id)]);
    };

    return (
      <Box
        ref={ref}
        width="100%"
        height="400px"
        bgcolor="white"
        position="absolute"
        top={80}
      >
        <Box
          flex={1}
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Box flex={1} />
          <Typography
            sx={{
              flex: 1,
              textAlign: 'center',
              marginRight: 'auto',
              marginLeft: 'auto',
            }}
            variant="body2"
          >
            Select lines to count
          </Typography>
          <Box flex={1} justifyContent="flex-end" display="flex">
            <ButtonWithIcon
              color="primary"
              variant="outlined"
              onClick={() => onConfirm(selectedRows)}
              label={'Confirm'}
              Icon={<PlusCircleIcon />}
            />
          </Box>
        </Box>
        <Box display="flex" flex={1}>
          <DataTable columns={columns} data={data} />
        </Box>
        <Box flex={1} display="flex" justifyContent="flex-end" marginRight={4}>
          <Fab
            size="small"
            sx={{ backgroundColor: 'transparent' }}
            onClick={onAddBatch}
          >
            <PlusCircleIcon />
          </Fab>
        </Box>
      </Box>
    );
  }
);
