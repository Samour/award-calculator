import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { createValidatedCell, workerShiftToEmptyValidated } from 'models/converters/workerShift';
import { WorkerShiftColumnName, WorkerShiftRow } from 'models/inputs/table';
import { ShiftEntryState, ValidatedWorkerShiftRow } from 'models/store/shiftEntry';
import { ENTRY_TABLE_LS_KEY } from './persistence';

export interface CellIdentifier {
  rowIndex: number;
  columnId: WorkerShiftColumnName;
}

export interface UpdateCellValue {
  cellIdentifier: CellIdentifier;
  value: string;
}

export interface SetCellValidationMessages {
  cellIdentifier: CellIdentifier;
  failureMessages: string[];
}

export interface DisplayCsvParsingFailureMessage {
  message: string;
}

export interface PopulateWorkerShiftTable {
  rows: ValidatedWorkerShiftRow[];
}

export interface PayComputationInProgress {
  payComputationInProgress: boolean;
}

const createEmptyRow = (): ValidatedWorkerShiftRow => ({
  employeeCode: createValidatedCell(''),
  lastName: createValidatedCell(''),
  firstName: createValidatedCell(''),
  basePayRate: createValidatedCell(''),
  shiftStartDate: createValidatedCell(''),
  shiftStartTime: createValidatedCell(''),
  shiftEndTime: createValidatedCell(''),
  casualLoading: createValidatedCell(''),
});

const readRowsFromLocal = (): ValidatedWorkerShiftRow[] => {
  const persisted = localStorage.getItem(ENTRY_TABLE_LS_KEY);
  if (persisted) {
    return (JSON.parse(persisted) as WorkerShiftRow[]).map((row) => workerShiftToEmptyValidated(row));
  } else {
    return [createEmptyRow()];
  }
};

const initialState: ShiftEntryState = {
  rows: readRowsFromLocal(),
  csvFileParsingError: {
    open: false,
    message: '',
  },
  tableValidationScrollNonce: '',
  payComputationInProgress: false,
};

const ensureEmptyTrailingRow = (mutableRows: ValidatedWorkerShiftRow[]) => {
  if (mutableRows.length === 0 || !rowIsEmpty(mutableRows[mutableRows.length - 1])) {
    mutableRows.push(createEmptyRow());
  }
};

const {
  actions: {
    updateCellValues,
    setCellValidationMessages,
    populateWorkerShiftTable,
    markPayComputationInProgress,
    invalidateTableValidationScrollNonce,
    displayCsvParsingFailureMessage,
    closeParsingFailureModal,
  },
  reducer,
} = createSlice({
  name: 'shiftEntry',
  initialState: initialState,
  reducers: {
    updateCellValues: (state, action: PayloadAction<UpdateCellValue[]>) => {
      const payload = action.payload;
      payload.forEach(({ cellIdentifier, value }) => {
        const cell = state.rows[cellIdentifier.rowIndex][cellIdentifier.columnId];
        cell.value = value;
        cell.failureMessages = [];
      });

      state.rows = state.rows.filter((r) => !rowIsEmpty(r));
      ensureEmptyTrailingRow(state.rows);
    },

    setCellValidationMessages: (state, action: PayloadAction<SetCellValidationMessages>) => {
      const payload = action.payload;
      const cell = state.rows[payload.cellIdentifier.rowIndex][payload.cellIdentifier.columnId];
      cell.failureMessages = payload.failureMessages;
    },

    populateWorkerShiftTable: (state, action: PayloadAction<PopulateWorkerShiftTable>) => {
      state.rows = action.payload.rows;
      ensureEmptyTrailingRow(state.rows);
    },

    markPayComputationInProgress: (state, action: PayloadAction<PayComputationInProgress>) => {
      state.payComputationInProgress = action.payload.payComputationInProgress;
    },

    invalidateTableValidationScrollNonce: (state) => {
      state.tableValidationScrollNonce = `${Math.random()}`;
    },

    displayCsvParsingFailureMessage: (state, action: PayloadAction<DisplayCsvParsingFailureMessage>) => {
      state.csvFileParsingError = {
        message: action.payload.message,
        open: true,
      };
    },

    closeParsingFailureModal: (state) => {
      state.csvFileParsingError.open = false;
    },
  },
});

const rowIsEmpty = (row: ValidatedWorkerShiftRow): boolean =>
  row.employeeCode.value === ''
  && row.lastName.value === ''
  && row.firstName.value === ''
  && row.basePayRate.value === ''
  && row.shiftStartDate.value === ''
  && row.shiftStartTime.value === ''
  && row.shiftEndTime.value === ''
  && row.casualLoading.value === '';

export {
  updateCellValues,
  setCellValidationMessages,
  populateWorkerShiftTable,
  markPayComputationInProgress,
  invalidateTableValidationScrollNonce,
  displayCsvParsingFailureMessage,
  closeParsingFailureModal,
  reducer as shiftEntryReducer,
};
