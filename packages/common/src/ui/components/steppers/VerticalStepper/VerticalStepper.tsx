import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import { styled } from '@mui/material';

import { LocaleKey, useTranslation } from '../../../../intl';

interface StepDefinition {
  label: LocaleKey;
  description: string;
}

interface StepperProps {
  activeStep: number;
  steps: StepDefinition[];
}

const StyledConnector = styled(StepConnector)(({ theme }) => ({
  '&.MuiStepConnector-root': {
    // This margin is an adjustment as the icon we use: the circle, is smaller
    // than what is the default size, so this tries to centre align the connector by
    // overriding the default.
    marginLeft: '5px',
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.gray.pale,

    // The width is for the connector which is significantly thicker than the default.
    // Additionally the height has been shrunk so that each connector hits the icons
    // on the top and bottom sufficiently.
    borderWidth: '0 0 0 6px',
    minHeight: 16,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.secondary.light,
    },
  },

  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.secondary.light,
    },
  },
}));

const Circle = styled('div', {
  shouldForwardProp: prop =>
    prop !== 'completed' && prop !== 'active' && prop !== 'error',
})<{
  completed: boolean;
  active: boolean;
}>(({ active, completed, theme }) => {
  // Base colours for all uncompleted and non-active steps.
  const colors = {
    borderColor: theme.palette.gray.pale,
    backgroundColor: theme.palette.gray.pale,
  };

  // If the step is completed, then everything is light.
  if (completed) {
    colors.backgroundColor = theme.palette.secondary.light;
    colors.borderColor = theme.palette.secondary.light;
  }

  // If the step is active, the center of the circle is white
  if (active) {
    colors.backgroundColor = 'white';
  }

  return {
    border: 'solid',

    // These numbers are arbitrary and are just what look good to me.
    // our designs have the circle icon at 16px - with the border I
    // believe this is 15px.. either 4px on the border or 13px on the
    // dimensions and it looks a bit off.. maybe this isn't how it works.
    borderWidth: '4px',
    width: '16px',
    height: '16px',
    borderRadius: '16px',
    ...colors,
  };
});

export const VerticalStepper: FC<StepperProps> = ({ activeStep, steps }) => {
  const t = useTranslation();

  return (
    <Box flex={1}>
      <Stepper
        connector={<StyledConnector />}
        activeStep={activeStep}
        orientation="vertical"
      >
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index <= activeStep;

          // There is no accessability role that I can find to accurately describe
          // a stepper, so turning to testids to mark the active/completed steps
          // for tests
          let testId = '';
          if (isActive) testId += 'active';
          if (isCompleted) testId += 'completed';

          return (
            <Step
              data-testid={testId}
              key={step.label}
              active={isActive}
              completed={isCompleted}
            >
              <StepLabel
                sx={{
                  '&.MuiStepLabel-root': {
                    padding: 0,
                    position: 'relative',
                    height: '8px',
                  },
                  '& .MuiStepLabel-iconContainer': {
                    paddingLeft: 0,
                  },
                  '& .MuiStepLabel-labelContainer': {
                    paddingLeft: '8px',
                  },
                }}
                StepIconComponent={Circle}
              >
                <Box
                  flexDirection="row"
                  display="flex"
                  flex={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="body2"
                    lineHeight={0}
                    fontSize="12px"
                    fontWeight="bold"
                  >
                    {t(step.label)}
                  </Typography>
                  <Typography
                    color="gray.main"
                    variant="body2"
                    lineHeight={0}
                    fontSize="12px"
                  >
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
