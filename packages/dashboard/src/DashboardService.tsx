import React from 'react';
import { Grid, usePageTitle, useTranslation } from '@openmsupply-client/common';
import { StockWidget } from './widgets';
import {
  InboundShipmentWidget,
  OutboundShipmentWidget,
} from '@openmsupply-client/invoices';

const Dashboard: React.FC = () => {
  const t = useTranslation('common');
  usePageTitle(t('app.dashboard'));
  return (
    <Grid
      container
      sx={{
        backgroundColor: 'background.toolbar',
        paddingBottom: '32px',
      }}
      justifyContent="space-evenly"
    >
      <InboundShipmentWidget />
      <OutboundShipmentWidget />
      <StockWidget />
    </Grid>
  );
};

export default Dashboard;
