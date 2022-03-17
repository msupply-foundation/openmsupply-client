import React from 'react';
import {
  ModalMode,
  useDialog,
  DialogButton,
  BasicSpinner,
  useBufferState,
  Box,
} from '@openmsupply-client/common';
import { ItemRowWithStatsFragment } from '@openmsupply-client/system';
import { RequestLineEditForm } from './RequestLineEditForm';
import { useIsRequestDisabled } from '../../api';
import { useNextRequestLine, useDraftRequisitionLine } from './hooks';
import { StockDistribution } from './ItemCharts/StockDistribution';
import { ConsumptionHistory } from './ItemCharts/ConsumptionHistory';

interface RequestLineEditProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode | null;
  item: ItemRowWithStatsFragment | null;
}

export const RequestLineEdit = ({
  isOpen,
  onClose,
  mode,
  item,
}: RequestLineEditProps) => {
  const disabled = useIsRequestDisabled();
  const { Modal } = useDialog({ onClose, isOpen });
  const [currentItem, setCurrentItem] = useBufferState(item);
  const { draft, isLoading, save, update } =
    useDraftRequisitionLine(currentItem);
  const { next, hasNext } = useNextRequestLine(currentItem);
  const nextDisabled = (!hasNext && mode === ModalMode.Update) || !currentItem;

  return (
    <Modal
      title={''}
      contentProps={{ sx: { padding: 0 } }}
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      nextButton={
        <DialogButton
          disabled={nextDisabled}
          variant="next"
          onClick={async () => {
            await save();
            if (mode === ModalMode.Update && next) setCurrentItem(next);
            else if (mode === ModalMode.Create) setCurrentItem(null);
            else onClose();
            // Returning true here triggers the slide animation
            return true;
          }}
        />
      }
      okButton={
        <DialogButton
          variant="ok"
          disabled={!currentItem}
          onClick={async () => {
            await save();
            onClose();
          }}
        />
      }
      height={600}
      width={1024}
    >
      {!isLoading ? (
        <>
          <RequestLineEditForm
            draftLine={draft}
            update={update}
            disabled={mode === ModalMode.Update || disabled}
            onChangeItem={setCurrentItem}
            item={currentItem}
          />
          <StockDistribution
            availableStockOnHand={draft?.itemStats?.availableStockOnHand}
            averageMonthlyConsumption={
              draft?.itemStats?.averageMonthlyConsumption
            }
            suggestedQuantity={draft?.suggestedQuantity}
          />
          <Box>
            <Box>
              <ConsumptionHistory draftLine={draft} />
            </Box>
          </Box>
        </>
      ) : (
        <BasicSpinner />
      )}
    </Modal>
  );
};
