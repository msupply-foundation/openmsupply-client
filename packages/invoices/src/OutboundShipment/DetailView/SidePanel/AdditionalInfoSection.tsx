import React, { FC, memo } from 'react';
import {
  Grid,
  DetailPanelSection,
  PanelField,
  PanelLabel,
  PanelRow,
  BufferedTextArea,
  useTranslation,
  ColorSelectButton,
  useBufferState,
} from '@openmsupply-client/common';
import { useOutboundFields, useIsOutboundDisabled } from '../../api';

export const AdditionalInfoSectionComponent: FC = () => {
  const t = useTranslation('common');
  const isDisabled = useIsOutboundDisabled();
  const { colour, comment, update } = useOutboundFields(['colour', 'comment']);
  const [colorBuffer, setColorBuffer] = useBufferState(colour);
  const [commentBuffer, setCommentBuffer] = useBufferState(comment ?? '');

  return (
    <DetailPanelSection title={t('heading.additional-info')}>
      <Grid container gap={0.5} key="additional-info">
        <PanelRow>
          <PanelLabel>{t('label.entered-by')}</PanelLabel>
        </PanelRow>

        <PanelRow>
          <PanelLabel>{t('label.color')}</PanelLabel>
          <PanelField>
            <ColorSelectButton
              disabled={isDisabled}
              onChange={color => {
                setColorBuffer(color.hex);
                update({ colour: color.hex });
              }}
              color={colorBuffer}
            />
          </PanelField>
        </PanelRow>

        <PanelLabel>{t('heading.comment')}</PanelLabel>
        <BufferedTextArea
          disabled={isDisabled}
          onChange={e => {
            setCommentBuffer(e.target.value);
            update({ comment: e.target.value });
          }}
          value={commentBuffer}
        />
      </Grid>
    </DetailPanelSection>
  );
};

export const AdditionalInfoSection = memo(AdditionalInfoSectionComponent);
