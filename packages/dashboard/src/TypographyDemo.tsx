import React from 'react';
import { Typography, Box } from '@openmsupply-client/common';

export const TypographyPage: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
      margin: 3,
    }}
  >
    <Typography variant="h1">Heading .h1</Typography>
    <Typography variant="h2">Heading .h2</Typography>
    <Typography variant="h3">Heading .h3</Typography>
    <Typography variant="h4">Heading .h4</Typography>
    <Typography variant="h5">Heading .h5</Typography>
    <Typography variant="h6">Heading .h6</Typography>
    <Typography variant="body1" mt={2}>
      Body 1 -- use for ??
    </Typography>
    <Typography variant="body2" mt={2}>
      Body 2 -- use for ??
    </Typography>
  </Box>
);
