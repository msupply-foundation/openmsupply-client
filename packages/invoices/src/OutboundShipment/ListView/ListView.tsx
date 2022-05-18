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

  const { data, isError, isLoading, sort, pagination, filter } =
    useOutbound.document.list();
  const {
    urlQuery,
    updateSortQuery,
    updatePaginationQuery,
    updateFilterQuery,
    onChangeUrlQuery,
  } = useHandleQueryParams({ sort, pagination, filterKey: 'otherPartyName' });
  const { sortBy } = sort;
  useDisableOutboundRows(data?.nodes);

  useEffect(() => {
    onChangeUrlQuery(columns, filter);
  }, [urlQuery]);

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
    { onChangeSortBy: () => {}, sortBy },
    [sortBy]
  );

  return (
    <>
      <Toolbar filter={filter} updateFilter={updateFilterQuery} />
      <AppBarButtons sortBy={sortBy} modalController={modalController} />

      <DataTable
        pagination={{ ...pagination, total: data?.totalCount }}
        onChangePage={updatePaginationQuery}
        onChangeSortBy={updateSortQuery}
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
