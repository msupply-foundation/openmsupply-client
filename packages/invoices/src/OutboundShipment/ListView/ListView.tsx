import React, { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useNavigate,
  DataTable,
  useColumns,
  getNameAndColorColumn,
  TableProvider,
  createTableStore,
  useTranslation,
  InvoiceNodeStatus,
  useTableStore,
  NothingHere,
  useToggle,
  createQueryParamsStore,
  useUrlQuery,
} from '@openmsupply-client/common';
import { getStatusTranslator, isOutboundDisabled } from '../../utils';
import { Toolbar } from './Toolbar';
import { AppBarButtons } from './AppBarButtons';
import { useOutbound } from '../api';
import { OutboundRowFragment } from '../api/operations.generated';

const useDisableOutboundRows = (rows?: OutboundRowFragment[]) => {
  const { setDisabledRows } = useTableStore();
  useEffect(() => {
    const disabledRows = rows?.filter(isOutboundDisabled).map(({ id }) => id);
    if (disabledRows) setDisabledRows(disabledRows);
  }, [rows]);
};
export const OutboundShipmentListViewComponent: FC = () => {
  const { mutate: onUpdate } = useOutbound.document.update();
  const t = useTranslation('distribution');
  const navigate = useNavigate();
  const modalController = useToggle();
  const { urlQuery } = useUrlQuery();

  const { data, isError, isLoading, sort, pagination, filter } =
    useOutbound.document.list();
  const { onChangeSortBy, sortBy } = sort;
  useDisableOutboundRows(data?.nodes);

  console.log('urlQuery', urlQuery);

  const columns = useColumns<OutboundRowFragment>(
    [
      [getNameAndColorColumn(), { setter: onUpdate }],
      [
        'status',
        {
          formatter: status =>
            getStatusTranslator(t)(status as InvoiceNodeStatus),
        },
      ],
      [
        'invoiceNumber',
        { description: 'description.invoice-number', maxWidth: 110 },
      ],
      'createdDatetime',
      {
        description: 'description.customer-reference',
        key: 'theirReference',
        label: 'label.reference',
      },
      ['comment'],
      [
        'totalAfterTax',
        {
          accessor: ({ rowData }) => rowData.pricing.totalAfterTax,
          width: '100%',
        },
      ],
      'selection',
    ],
    { onChangeSortBy, sortBy },
    []
  );

  return (
    <>
      <Toolbar filter={filter} />
      <AppBarButtons sortBy={sortBy} modalController={modalController} />
      <DataTable
        pagination={{ ...pagination, total: data?.totalCount }}
        onChangePage={pagination.onChangePage}
        columns={columns}
        data={data?.nodes ?? []}
        isError={isError}
        isLoading={isLoading}
        noDataElement={
          <NothingHere
            body={t('error.no-outbound-shipments')}
            onCreate={modalController.toggleOn}
          />
        }
        onRowClick={row => {
          navigate(String(row.invoiceNumber));
        }}
      />
    </>
  );
};

export const OutboundShipmentListView: FC = () => (
  <TableProvider
    createStore={createTableStore}
    queryParamsStore={createQueryParamsStore<OutboundRowFragment>({
      initialSortBy: { key: 'otherPartyName' },
    })}
  >
    <OutboundShipmentListViewComponent />
  </TableProvider>
);
