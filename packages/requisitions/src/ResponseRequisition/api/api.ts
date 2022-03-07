import {
  RequisitionNodeStatus,
  SortBy,
  FilterBy,
  RequisitionSortFieldInput,
  RequisitionNodeType,
  UpdateResponseRequisitionInput,
  UpdateResponseRequisitionStatusInput,
  UpdateResponseRequisitionLineInput,
} from '@openmsupply-client/common';
import {
  ResponseFragment,
  ResponseRowFragment,
  Sdk,
} from './operations.generated';
import { DraftResponseLine } from './../DetailView/ResponseLineEdit/hooks';

export type ListParams = {
  first: number;
  offset: number;
  sortBy: SortBy<ResponseRowFragment>;
  filterBy: FilterBy | null;
};

const responseParser = {
  toStatus: (
    patch: Partial<ResponseFragment> & { id: string }
  ): UpdateResponseRequisitionStatusInput | undefined => {
    switch (patch.status) {
      case RequisitionNodeStatus.Finalised:
        return UpdateResponseRequisitionStatusInput.Finalised;
      default:
        return undefined;
    }
  },
  toSortField: (
    sortBy: SortBy<ResponseRowFragment>
  ): RequisitionSortFieldInput => {
    switch (sortBy.key) {
      case 'createdDatetime': {
        return RequisitionSortFieldInput.CreatedDatetime;
      }
      case 'otherPartyName': {
        return RequisitionSortFieldInput.OtherPartyName;
      }
      case 'requisitionNumber': {
        return RequisitionSortFieldInput.RequisitionNumber;
      }
      case 'status': {
        return RequisitionSortFieldInput.Status;
      }

      case 'sentDatetime':
      case 'finalisedDatetime':
      case 'comment':
      default: {
        return RequisitionSortFieldInput.CreatedDatetime;
      }
    }
  },
  toUpdate: (
    requisition: Partial<ResponseFragment> & { id: string }
  ): UpdateResponseRequisitionInput => {
    return {
      id: requisition.id,
      comment: requisition.comment,
      theirReference: requisition.theirReference,
      colour: requisition.colour,
      status: responseParser.toStatus(requisition),
    };
  },
  toUpdateLine: (
    patch: DraftResponseLine
  ): UpdateResponseRequisitionLineInput => ({
    id: patch.id,
    supplyQuantity: patch.supplyQuantity,
  }),
};

export const getResponseQueries = (sdk: Sdk, storeId: string) => ({
  get: {
    list: async ({ first, offset, sortBy, filterBy }: ListParams) => {
      const result = await sdk.responses({
        storeId,
        page: { offset, first },
        sort: {
          key: responseParser.toSortField(sortBy),
          desc: !!sortBy.isDesc,
        },
        filter: {
          ...filterBy,
          type: { equalTo: RequisitionNodeType.Response },
        },
      });
      return result.requisitions;
    },
    byNumber: async (requisitionNumber: string): Promise<ResponseFragment> => {
      const result = await sdk.responseByNumber({
        storeId,
        requisitionNumber: Number(requisitionNumber),
      });

      if (result.requisitionByNumber.__typename === 'RequisitionNode') {
        return result.requisitionByNumber;
      }

      throw new Error('Record not found');
    },
  },
  update: async (
    patch: Partial<ResponseFragment> & { id: string }
  ): Promise<{ __typename: 'RequisitionNode'; id: string }> => {
    const input = responseParser.toUpdate(patch);
    const result = await sdk.updateResponse({ storeId, input });

    const { updateResponseRequisition } = result;

    if (updateResponseRequisition.__typename === 'RequisitionNode') {
      return updateResponseRequisition;
    }

    throw new Error('Unable to update requisition');
  },
  updateLine: async (patch: DraftResponseLine) => {
    const result = await sdk.updateResponseLine({
      storeId,
      input: responseParser.toUpdateLine(patch),
    });

    if (
      result.updateResponseRequisitionLine.__typename === 'RequisitionLineNode'
    ) {
      return result.updateResponseRequisitionLine;
    } else throw new Error('Could not update response line');
  },
  createOutboundFromResponse: async (responseId: string): Promise<number> => {
    const result = await sdk.createOutboundFromResponse({
      storeId,
      responseId,
    });

    if (result.createRequisitionShipment.__typename === 'InvoiceNode') {
      return result.createRequisitionShipment.invoiceNumber;
    }

    if (
      result.createRequisitionShipment.__typename ===
      'CreateRequisitionShipmentError'
    ) {
      throw new Error(result.createRequisitionShipment.error.__typename);
    }

    throw new Error('Could not create outbound');
  },
});
