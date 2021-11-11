import { ObjectWithStringKeys } from './utility';

export * from './utility';
export * from './schema';

type RecordWithId = { id: string };

export interface DomainObject extends RecordWithId, ObjectWithStringKeys {}

export interface Name extends DomainObject {
  id: string;
  code: string;
  name: string;
  isCustomer: boolean;
  isSupplier: boolean;
}

export interface Item extends DomainObject {
  id: string;
  isVisible: boolean;
  code: string;
  name: string;
  availableQuantity: number;
  availableBatches: StockLine[];
  unitName: string;
}

export interface StockLine extends DomainObject {
  id: string;
  availableNumberOfPacks: number;
  costPricePerPack: number;
  expiryDate?: string | null;
  batch?: string | null;
  packSize: number;
  sellPricePerPack: number;
  totalNumberOfPacks: number;
  locationDescription?: string | null;
  onHold: boolean;
}

export type Test = {
  id: string;
  message: string;
};

export type User = {
  id: string;
  name: string;
};

export type Store = {
  id: string;
  name: string;
};

export interface InvoiceLine extends DomainObject {
  id: string;

  itemId: string;
  itemName: string;
  itemCode: string;
  itemUnit: string;
  packSize: number;
  numberOfPacks: number;
  costPricePerPack: number;
  sellPricePerPack: number;

  expiryDate?: string | null;

  batch?: string | null;

  locationDescription?: string | null;
  note?: string | null;
}

export interface InvoiceRow extends DomainObject {
  id: string;
  color: string;
  comment?: string | null;
  status: string;
  type: string;
  draftDatetime: string;
  allocatedDatetime?: string | null;
  pickedDatetime?: string | null;
  shippedDatetime?: string | null;
  deliveredDatetime?: string | null;
  invoiceNumber: number;
  otherPartyName: string;
  pricing: {
    totalAfterTax: number;
    subtotal: number;
    taxPercentage: number;
  };
}

export interface Invoice extends DomainObject {
  id: string;
  color: string;
  comment?: string | null;
  theirReference?: string | null;
  status: string;
  type: string;
  invoiceNumber: number;
  otherParty?: Name;
  otherPartyName: string;
  onHold: boolean;
  lines: InvoiceLine[];
  draftDatetime: string;
  allocatedDatetime?: string | null;
  shippedDatetime?: string | null;
  pickedDatetime?: string | null;
  deliveredDatetime?: string | null;
  enteredByName: string;

  purchaseOrderNumber?: number | null;
  requisitionNumber?: number | null;
  goodsReceiptNumber?: number | null;
  inboundShipmentNumber?: number | null;

  pricing: {
    totalAfterTax: number;
    subtotal: number;
    taxPercentage: number;
  };
}

export type OutboundShipmentStatus =
  | 'DRAFT'
  | 'ALLOCATED'
  | 'PICKED'
  | 'SHIPPED'
  | 'DELIVERED';

export type InboundShipmentStatus =
  | 'new'
  | 'allocated'
  | 'picked'
  | 'shipped'
  | 'delivered';

export type SupplierRequisitionStatus =
  | 'draft'
  | 'sent'
  | 'in_progress'
  | 'finalised';

export type CustomerRequisitionStatus = 'new' | 'in_progress' | 'finalised';
