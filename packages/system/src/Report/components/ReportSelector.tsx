import React, { FC } from 'react';
import { Box, ReportCategory, Typography } from '@openmsupply-client/common';
import { AlertIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import {
  CircularProgress,
  FlatButton,
  PaperPopoverSection,
  usePaperClickPopover,
} from '@common/components';
import { ReportRowFragment, useReports } from '../api';

interface ReportSelectorProps {
  category?: ReportCategory;
  onClick: (report: ReportRowFragment) => void;
}

const NoReports = () => {
  const t = useTranslation('common');
  return (
    <Box display="flex" alignItems="center" gap={1} padding={2}>
      <Box flex={0}>
        <AlertIcon fontSize="small" color="primary" />
      </Box>
      <Typography flex={1}>{t('error.no-reports-available')}</Typography>
    </Box>
  );
};

export const ReportSelector: FC<ReportSelectorProps> = ({
  category,
  children,
  onClick,
}) => {
  const { hide, PaperClickPopover } = usePaperClickPopover();
  const { data, isLoading } = useReports(category);
  const t = useTranslation('app');

  const reportButtons = data?.nodes.map(report => (
    <FlatButton
      label={report.name}
      onClick={() => {
        hide();
        onClick(report);
      }}
      key={report.id}
      sx={{ textAlign: 'left', justifyContent: 'left' }}
    />
  ));

  const noReports = !isLoading && !data?.nodes.length;

  return (
    <PaperClickPopover
      placement="bottom"
      width={350}
      Content={
        <PaperPopoverSection label={t('select-report')}>
          {isLoading ? (
            <CircularProgress size={12} />
          ) : (
            <Box
              style={{ maxHeight: '200px', overflowY: 'auto' }}
              display="flex"
              flexDirection="column"
            >
              {noReports ? <NoReports /> : reportButtons}
            </Box>
          )}
        </PaperPopoverSection>
      }
    >
      {children}
    </PaperClickPopover>
  );
};
