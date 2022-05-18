import React, { FC, useEffect } from 'react';
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
  useHandleQueryParams,
} from '@openmsupply-client/common';
import { getStatusTranslator, isOutboundDisabled } from '../../utils';
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

  // You can either take the sort, pagination, filter state from
  // this hook, or alternatively use the query params hook below,
  // but they should be the same as they're just backed by the URL
  // state which is global.
  // I'd probably recommend the query params hook and simplify
  // the list hook but I'd probably flip on that opinion in a heart beat
  const { data, isError, isLoading, sortBy, page, first, offset } =
    useOutbound.document.list();
  const { updateSortQuery, updatePaginationQuery } = useHandleQueryParams();

  const pagination = { page, first, offset };

  useDisableOutboundRows(data?.nodes);

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
    { onChangeSortBy: updateSortQuery, sortBy },

    [
      sortBy,

      // Can fix the stale closure using this deps array (same as useEffect etc)
      // But I don't believe it's needed anymore? Idk maybe add it to avoid bugs
      // updateSortQuery
    ]
  );

  return (
    <>
      {/* <Toolbar filter={filter} updateFilter={updateFilterQuery} /> */}
      <AppBarButtons sortBy={sortBy} modalController={modalController} />

      <DataTable
        pagination={{ ...pagination, total: data?.totalCount }}
        onChangePage={updatePaginationQuery}
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
