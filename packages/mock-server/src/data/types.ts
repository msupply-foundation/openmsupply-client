export interface Item {
  id: string;
  code: string;
  name: string;
}

export interface Name {
  id: string;
  code: string;
  name: string;
  isCustomer: boolean;
  isSupplier: boolean;
}

export interface ResolvedItem extends Item {
  availableQuantity: number;
}

export interface StockLine {
  id: string;
  expiry: string;
  name: string;
  availableNumberOfPacks: number;
  packSize: number;
  itemId: string;
}

export interface ResolvedStockLine extends StockLine {
  item: Item;
}

export interface InvoiceLine {
  id: string;
  itemName: string;
  itemCode?: string;
  quantity: number;
  batchName?: string;
  expiry: string;
  stockLineId: string;
  itemId: string;
  invoiceId: string;
}

export interface ResolvedInvoiceLine extends InvoiceLine {
  stockLine: StockLine;
  item: Item;
}

export interface Invoice {
  id: string;
  color: string;
  comment: string;
  status: string;
  type: string;
  entered: string;
  confirmed: string;
  invoiceNumber: string;
  total: string;
  nameId: string;
}

export interface ResolvedInvoice extends Invoice {
  lines: InvoiceLine[];
  name: Name;
  otherPartyName: string;
}