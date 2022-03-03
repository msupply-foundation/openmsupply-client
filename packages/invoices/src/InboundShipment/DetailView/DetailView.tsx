import React, { FC } from 'react';
import {
  TableProvider,
  createTableStore,
  useEditModal,
  DetailViewSkeleton,
  AlertModal,
  useNavigate,
  RouteBuilder,
  useTranslation,
} from '@openmsupply-client/common';
import { AppRoute } from '@openmsupply-client/config';
import { toItemRow, ItemRowFragment } from '@openmsupply-client/system';
import { Toolbar } from './Toolbar';
import { Footer } from './Footer';
import { AppBarButtons } from './AppBarButtons';
import { SidePanel } from './SidePanel';
import { GeneralTab } from './GeneralTab';
import { InboundLineEdit } from './modals/InboundLineEdit';
import { InboundItem } from '../../types';
import { useInbound, InboundLineFragment } from '../api';

export const DetailView: FC = () => {
  const { data, isLoading } = useInbound();
  const { onOpen, onClose, mode, entity, isOpen } =
    useEditModal<ItemRowFragment>();
  const navigate = useNavigate();
  const t = useTranslation('replenishment');

  const onRowClick = React.useCallback(
    (line: InboundItem | InboundLineFragment) => {
      onOpen(toItemRow(line));
    },
    [onOpen]
  );

  if (isLoading) return <DetailViewSkeleton hasGroupBy={true} hasHold={true} />;

  return (
    <React.Suspense
      fallback={<DetailViewSkeleton hasGroupBy={true} hasHold={true} />}
    >
      {data ? (
        <TableProvider createStore={createTableStore}>
          <AppBarButtons onAddItem={() => onOpen()} />

          <Toolbar />

          <GeneralTab onRowClick={onRowClick} />

          <Footer />
          <SidePanel />

          {isOpen && (
            <InboundLineEdit
              isOpen={isOpen}
              onClose={onClose}
              mode={mode}
              item={entity}
            />
          )}
        </TableProvider>
      ) : (
        <AlertModal
          open={true}
          onOk={() =>
            navigate(
              RouteBuilder.create(AppRoute.Replenishment)
                .addPart(AppRoute.InboundShipment)
                .build()
            )
          }
          title={t('error.shipment-not-found')}
          message={t('messages.click-to-return-to-shipments')}
        />
      )}
    </React.Suspense>
  );
};
