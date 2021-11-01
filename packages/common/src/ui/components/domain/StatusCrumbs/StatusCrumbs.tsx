import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ChevronDownIcon } from '../../../icons';
import {
  LocaleKey,
  useTranslation,
  useFormatDate,
} from '../../../../intl/intlHelpers';
import { VerticalStepper } from '../../steppers/VerticalStepper';
import { usePopover } from '../../popover';

interface StatusCrumbsProps<StatusType extends string> {
  statuses: StatusType[];
  statusLog: Record<StatusType, string | null>;
  statusFormatter: (status: StatusType) => LocaleKey;
}

const useSteps = <StatusType extends string>({
  statuses,
  statusLog,
  statusFormatter,
}: StatusCrumbsProps<StatusType>) => {
  const d = useFormatDate();
  return statuses.map(status => ({
    label: statusFormatter(status),
    description: statusLog[status] ? d(new Date(statusLog[status] ?? '')) : '',
  }));
};

export const StatusCrumbs = <StatusType extends string>(
  props: StatusCrumbsProps<StatusType>
): JSX.Element => {
  const { statuses, statusLog, statusFormatter } = props;
  const t = useTranslation();

  const { show, hide, Popover } = usePopover();
  const steps = useSteps(props);

  const currentStep = statuses.reduce((acc, status, idx) => {
    if (statusLog[status]) return idx;
    return acc;
  }, 0);

  return (
    <>
      <Popover>
        <Box gap={2} p={3} flexDirection="column" display="flex">
          <Typography fontWeight="700">{t('label.order-history')}</Typography>
          <VerticalStepper activeStep={currentStep} steps={steps} />
        </Box>
      </Popover>

      <Box
        height="100%"
        display="flex"
        alignItems="center"
        onMouseOver={show}
        onMouseLeave={hide}
        onClick={show}
        sx={{ cursor: 'help' }}
      >
        <Breadcrumbs
          separator={
            <ChevronDownIcon
              fontSize="small"
              sx={{
                // TODO: Add a ChevronLeftIcon..
                transform: 'rotate(270deg)',
                // These special margins give some space between each crumb. Could have added it to the Typography
                // but this seemed fine
                marginLeft: '5px',
                marginRight: '5px',
              }}
            />
          }
        >
          {statuses.map(status => {
            const date = statusLog[status];

            return (
              <Typography
                color={date ? 'secondary' : 'midGrey'}
                key={status}
                sx={{ fontWeight: 700, fontSize: '12px' }}
              >
                {t(statusFormatter(status))}
              </Typography>
            );
          })}
        </Breadcrumbs>
      </Box>
    </>
  );
};
