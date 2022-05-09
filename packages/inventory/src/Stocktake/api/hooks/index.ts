import { Document } from './document';
import { Lines } from './line';
import { Utils } from './utils';

export const useStocktake = {
  document: {
    get: Document.useStocktake,
    list: Document.useStocktakes,
    listAll: Document.useStocktakesAll,

    delete: Document.useStocktakeDelete,
    deleteSelected: Document.useStocktakeDeleteSelected,
    insert: Document.useInsertStocktake,
    update: Document.useUpdateStocktake,

    fields: Document.useStocktakeFields,
  },
  line: {
    stocktakeItems: Lines.useStocktakeItems,
    stocktakeLines: Lines.useStocktakeLines,
    rows: Lines.useStocktakeRows,

    delete: Lines.useStocktakeDeleteLines,
    deleteSelected: Lines.useStocktakeDeleteSelectedLines,
    save: Lines.useSaveStocktakeLines,
  },
  utils: {
    api: Utils.useStocktakeApi,
    isDisabled: Utils.useIsStocktakeDisabled,
  },
};
