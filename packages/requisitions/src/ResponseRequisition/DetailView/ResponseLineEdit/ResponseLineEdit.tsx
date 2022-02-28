import React from 'react';
import {
  useDialog,
  DialogButton,
  BasicSpinner,
  useBufferState,
} from '@openmsupply-client/common';
import { ResponseLineEditForm } from './ResponseLineEditForm';
import {
  useIsResponseRequisitionDisabled,
  ResponseRequisitionLineFragment,
} from '../../api';
import { useDraftRequisitionLine, useNextResponseLine } from './hooks';

interface ResponseLineEditProps {
  isOpen: boolean;
  onClose: () => void;
  line: ResponseRequisitionLineFragment;
}

export const ResponseLineEdit = ({
  isOpen,
  onClose,
  line,
}: ResponseLineEditProps) => {
  const [currentLine, setCurrentLine] = useBufferState(line);
  const isDisabled = useIsResponseRequisitionDisabled();
  const { Modal } = useDialog({ onClose, isOpen });
  const { draft, isLoading, save, update } =
    useDraftRequisitionLine(currentLine);
  const { next, hasNext } = useNextResponseLine(currentLine);

  return (
    <Modal
      title={''}
      contentProps={{ sx: { padding: 0 } }}
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      nextButton={
        <DialogButton
          disabled={hasNext}
          variant="next"
          onClick={() => {
            next && setCurrentLine(next);
            // Returning true triggers the animation/slide out
            return true;
          }}
        />
      }
      okButton={
        <DialogButton
          variant="ok"
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
        <ResponseLineEditForm
          draftLine={draft}
          update={update}
          disabled={isDisabled}
        />
      ) : (
        <BasicSpinner />
      )}
    </Modal>
  );
};
