import React, { memo } from 'react';
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
  InfoTooltipIcon,
} from '@openmsupply-client/common';
import { useInboundFields, useIsInboundDisabled } from '../../api';

export const AdditionalInfoSectionComponent = () => {
  const { user, comment, colour, update } = useInboundFields([
    'comment',
    'colour',
    'user',
  ]);
  const isDisabled = useIsInboundDisabled();
  const t = useTranslation(['common', 'replenishment']);
  const [bufferedColor, setBufferedColor] = useBufferState(colour);

  return (
    <DetailPanelSection title={t('heading.additional-info')}>
      <Grid container gap={0.5} key="additional-info">
        <PanelRow>
          <PanelLabel>{t('label.entered-by')}</PanelLabel>
          <PanelField>{user?.username}</PanelField>
          {user?.email ? <InfoTooltipIcon title={user?.email} /> : null}
        </PanelRow>

        <PanelRow>
          <PanelLabel>{t('label.color')}</PanelLabel>
          <PanelField>
            <ColorSelectButton
              disabled={isDisabled}
              onChange={({ hex }) => {
                setBufferedColor(hex);
                update({ colour: hex });
              }}
              color={bufferedColor}
            />
          </PanelField>
        </PanelRow>

        <PanelLabel>{t('heading.comment')}</PanelLabel>
        <BufferedTextArea
          disabled={isDisabled}
          onChange={e => update({ comment: e.target.value })}
          value={comment}
        />
      </Grid>
    </DetailPanelSection>
  );
};

export const AdditionalInfoSection = memo(AdditionalInfoSectionComponent);
