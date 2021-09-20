import { useMediaQuery, useTheme } from '@mui/material';

export const useIsSmallScreen = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};
