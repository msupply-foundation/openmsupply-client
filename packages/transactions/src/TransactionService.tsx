import React, { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

import { RouteBuilder } from '@openmsupply-client/common';
import { AppRoute } from '@openmsupply-client/config';
import {
  OutboundShipmentDetailView,
  OutboundShipmentListView,
} from './OutboundShipment';

const TransactionService: FC = () => {
  const outboundShipmentsRoute = RouteBuilder.create(
    AppRoute.OutboundShipment
  ).build();

  const outboundShipmentRoute = RouteBuilder.create(AppRoute.OutboundShipment)
    .addPart(':id')
    .build();

  return (
    <Routes>
      <Route
        path={outboundShipmentsRoute}
        element={<OutboundShipmentListView />}
      />
      <Route
        path={outboundShipmentRoute}
        element={
          <>
            <OutboundShipmentDetailView />
            <OutboundShipmentDetailView />
          </>
        }
      />
    </Routes>
  );
};

export default TransactionService;
