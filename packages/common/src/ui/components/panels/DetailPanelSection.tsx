import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  styled,
  Typography,
} from '@mui/material';
import { Divider } from '../../components/divider/Divider';
import { ChevronDownIcon } from '../../icons';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.menu,
  boxShadow: 'none',
  '&.Mui-expanded': { margin: 0 },
  '&:before': { backgroundColor: 'transparent' },
  '& p.MuiTypography-root': { fontSize: 12 },
}));

export interface DetailPanelSectionProps {
  title: string;
  defaultExpanded?: boolean;
}

export const DetailPanelSection: React.FC<DetailPanelSectionProps> = ({
  children,
  title,
  defaultExpanded = true,
}) => (
  <Box>
    <StyledAccordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ChevronDownIcon />}>
        <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </StyledAccordion>
    <Divider />
  </Box>
);
