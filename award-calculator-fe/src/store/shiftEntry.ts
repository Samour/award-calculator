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

const initialState = (): ShiftEntryState => {
  const persisted = localStorage.getItem(ENTRY_TABLE_LS_KEY);
  if (persisted) {
    return {
      rows: (JSON.parse(persisted) as WorkerShiftRow[]).map((row) => workerShiftToEmptyValidated(row))
    };
  } else {
    return {
      rows: [createEmptyRow()],
    };
  }
};

const {
  actions: {
    updateCellValues,
    setCellValidationMessages,
  },
  reducer,
} = createSlice({
  name: 'shiftEntry',
  initialState: initialState(),
  reducers: {
    updateCellValues: (state, action: PayloadAction<UpdateCellValue[]>) => {
      const payload = action.payload;
      payload.forEach(({ cellIdentifier, value }) => {
        const cell = state.rows[cellIdentifier.rowIndex][cellIdentifier.columnId];
        cell.value = value;
        cell.failureMessages = [];
      });

      state.rows = state.rows.filter((r) => !rowIsEmpty(r));
      if (state.rows.length === 0 || !rowIsEmpty(state.rows[state.rows.length - 1])) {
        state.rows.push(createEmptyRow());
      }
    },
    setCellValidationMessages: (state, action: PayloadAction<SetCellValidationMessages>) => {
      const payload = action.payload;
      const cell = state.rows[payload.cellIdentifier.rowIndex][payload.cellIdentifier.columnId];
      cell.failureMessages = payload.failureMessages;
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
  reducer as shiftEntryReducer,
};