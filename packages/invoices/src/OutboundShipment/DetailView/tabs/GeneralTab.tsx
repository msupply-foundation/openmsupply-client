import React, { FC } from 'react';
import {
  DataTable,
  ObjectWithStringKeys,
  usePagination,
  Column,
  DomainObject,
  Box,
  FormProvider,
  useForm,
  ExpandContentProps,
} from '@openmsupply-client/common';
import { ItemRow } from '../types';
import { BatchesTable } from '../modals/BatchesTable';

interface GeneralTabProps<T extends ObjectWithStringKeys & DomainObject> {
  data: T[];
  columns: Column<T>[];
}

const Expand = (props: ExpandContentProps<ItemRow>) => {
  const methods = useForm({ mode: 'onBlur' });
  return (
    <Box p={1}>
      <Box height="100%" borderRadius={4}>
        <FormProvider {...methods}>
          <form>
            <BatchesTable
              item={props?.rowData?.item ?? null}
              onChange={() => {}}
              rows={
                props?.rowData?.item?.availableBatches?.nodes?.map(batch => ({
                  ...batch,
                  quantity: 0,
                })) ?? []
              }
              register={(() => {}) as unknown as any}
            />
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
};

export const GeneralTabComponent: FC<GeneralTabProps<ItemRow>> = ({
  data,
  columns,
}) => {
  const { pagination } = usePagination(20);

  return (
    <DataTable
      ExpandContent={Expand}
      pagination={{ ...pagination, total: data.length }}
      columns={columns}
      data={data.slice(pagination.offset, pagination.offset + pagination.first)}
      onChangePage={pagination.onChangePage}
      noDataMessageKey="error.no-items"
    />
  );
};

export const GeneralTab = React.memo(GeneralTabComponent);
