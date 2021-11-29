import { invoiceResolver } from './invoice';
import { itemResolver } from './item';
import { stockLineResolver } from './stockLine';
import { nameResolver } from './name';
import { requisitionResolver } from './requisition';
import { requisitionLineResolver } from './requisitionLine';
import { invoiceLineResolver } from './invoiceLine';
import { statisticsResolver } from './statistics';

export const ResolverService = {
  invoice: invoiceResolver,
  item: itemResolver,
  stockLine: stockLineResolver,
  requisitionLine: requisitionLineResolver,
  invoiceLine: invoiceLineResolver,
  requisition: requisitionResolver,
  name: nameResolver,
  statistics: statisticsResolver,
};