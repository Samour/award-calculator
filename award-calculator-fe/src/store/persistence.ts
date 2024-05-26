import { Middleware } from '@reduxjs/toolkit';
import { validatedToWorkerShift } from 'models/converters/workerShift';
import { AppState } from 'models/store';
import { ViewOptions } from 'models/store/payReport';
import { ValidatedWorkerShiftRow } from 'models/store/shiftEntry';

export const ENTRY_TABLE_LS_KEY = 'v1/workerShiftEntryTable';

export const shiftWorkerTablePersistenceMiddleware: () => Middleware = () => {
  let lastRows: ValidatedWorkerShiftRow[] | null = null;
  return store => next => action => {
    next(action);
    const rows = (store.getState() as AppState).shiftEntry.rows;
    if (rows !== lastRows) {
      const persistableRows = rows.map((row) => validatedToWorkerShift(row));
      localStorage.setItem(ENTRY_TABLE_LS_KEY, JSON.stringify(persistableRows));
      lastRows = rows;
    }
  };
};

export const PAY_REPORT_VIEW_OPTIONS_LS_KEY = 'v1/payReportViewOptions';

export const payReportViewOptionsPersistenceMiddleware: () => Middleware = () => {
  let lastViewOptions: ViewOptions | null = null;
  return store => next => action => {
    next(action);
    const { viewOptions } = (store.getState() as AppState).payReport;
    if (viewOptions !== lastViewOptions) {
      localStorage.setItem(PAY_REPORT_VIEW_OPTIONS_LS_KEY, JSON.stringify(viewOptions));
      lastViewOptions = viewOptions;
    }
  };
};
