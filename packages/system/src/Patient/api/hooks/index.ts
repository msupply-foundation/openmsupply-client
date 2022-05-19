import { Document } from './document';
import { Utils } from './utils';

export const useName = {
  api: Utils.usePatientApi,
  document: {
    get: Document.usePatient,
    list: Document.usePatients,
    listAll: Document.usePatientsAll,
  },
};
