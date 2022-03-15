import React from 'react';
import {
  Typography,
  DialogButton,
  Grid,
  useDialog,
  InlineSpinner,
  Box,
  useTranslation,
  ModalMode,
  useBufferState,
  useDirtyCheck,
  TableProvider,
  createTableStore,
} from '@openmsupply-client/common';
import { ItemRowFragment } from '@openmsupply-client/system';
import { OutboundLineEditTable } from './OutboundLineEditTable';
import { OutboundLineEditForm } from './OutboundLineEditForm';
import {
  useDraftOutboundLines,
  usePackSizeController,
  useNextItem,
} from './hooks';
import {
  allocateQuantities,
  sumAvailableQuantity,
  getAllocatedQuantity,
} from './utils';
import {
  useIsOutboundDisabled,
  useOutboundFields,
  useSaveOutboundLines,
} from '../../api';

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemRowFragment | null;
  mode: ModalMode | null;
}

export const OutboundLineEdit: React.FC<ItemDetailsModalProps> = ({
  isOpen,
  onClose,
  item,
  mode,
}) => {
  const t = useTranslation(['distribution']);
  const { Modal } = useDialog({ isOpen, onClose });
  const [currentItem, setCurrentItem] = useBufferState(item);

  const { mutate } = useSaveOutboundLines();
  const { status } = useOutboundFields('status');
  const isDisabled = useIsOutboundDisabled();
  const {
    draftOutboundLines,
    updateQuantity,
    setDraftOutboundLines,
    isLoading,
  } = useDraftOutboundLines(currentItem);
  const packSizeController = usePackSizeController(draftOutboundLines);
  const { next, disabled: nextDisabled } = useNextItem(currentItem?.id);
  const { setIsDirty } = useDirtyCheck();

  const onNext = async () => {
    await mutate(draftOutboundLines);
    if (mode === ModalMode.Update && next) setCurrentItem(next);
    else if (mode === ModalMode.Create) setCurrentItem(null);
    else onClose();
    // Returning true here triggers the slide animation
    return true;
  };

  const onAllocate = (newVal: number, packSize: number | null) => {
    const newAllocateQuantities = allocateQuantities(
      status,
      draftOutboundLines
    )(newVal, packSize);
    setIsDirty(true);
    setDraftOutboundLines(newAllocateQuantities ?? draftOutboundLines);
  };

  const canAutoAllocate = !!(currentItem && draftOutboundLines.length);
  const okNextDisabled =
    (mode === ModalMode.Update && nextDisabled) || !currentItem;

  return (
    <Modal
      title={t(
        mode === ModalMode.Update ? 'heading.edit-item' : 'heading.add-item'
      )}
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      nextButton={
        <DialogButton
          disabled={okNextDisabled}
          variant="next"
          onClick={onNext}
        />
      }
      okButton={
        <DialogButton
          disabled={!currentItem}
          variant="ok"
          onClick={async () => {
            try {
              await mutate(draftOutboundLines);
              onClose();
            } catch (e) {
              // console.log(e);
            }
          }}
        />
      }
      height={700}
      width={900}
    >
      <Grid container gap={0.5}>
        <OutboundLineEditForm
          disabled={mode === ModalMode.Update || isDisabled}
          packSizeController={packSizeController}
          onChangeItem={setCurrentItem}
          item={currentItem}
          allocatedQuantity={getAllocatedQuantity(draftOutboundLines)}
          availableQuantity={sumAvailableQuantity(draftOutboundLines)}
          onChangeQuantity={onAllocate}
          canAutoAllocate={canAutoAllocate}
        />

        {!!currentItem ? (
          !isLoading ? (
            canAutoAllocate ? (
              <TableProvider createStore={createTableStore}>
                <OutboundLineEditTable
                  packSizeController={packSizeController}
                  onChange={updateQuantity}
                  rows={draftOutboundLines}
                />
              </TableProvider>
            ) : (
              <NoStock />
            )
          ) : (
            <Box
              display="flex"
              flex={1}
              height={400}
              justifyContent="center"
              alignItems="center"
            >
              <InlineSpinner />
            </Box>
          )
        ) : null}
      </Grid>
    </Modal>
  );
};

const NoStock = () => {
  const t = useTranslation('distribution');
  return (
    <Box sx={{ margin: 'auto' }}>
      <Typography>{t('messages.no-stock-available')}</Typography>
    </Box>
  );
};
