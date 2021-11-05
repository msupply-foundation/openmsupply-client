import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocaleKey, useTranslation } from '../../../intl/intlHelpers';
import { DefaultButtonStyles } from './styles';

interface NavigationButtonProps {
  icon: React.ReactNode;
  labelKey: LocaleKey;
  to: string;
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  ...DefaultButtonStyles,
  boxShadow: theme.shadows[2],
  color: theme.palette.primary.main,
  minWidth: 115,
}));

export const NavigationButton: FC<NavigationButtonProps> = props => {
  const { icon, labelKey, to } = props;
  const t = useTranslation();
  const navigate = useNavigate();

  return (
    <StyledButton
      onClick={() => navigate(to)}
      startIcon={icon}
      variant="contained"
    >
      {t(labelKey)}
    </StyledButton>
  );
};
