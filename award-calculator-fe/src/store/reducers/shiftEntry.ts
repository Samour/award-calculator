import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WorkerShiftColumnName } from 'models/inputs/table';
import { ShiftEntryState, ValidatedCell, ValidatedWorkerShiftRow } from 'models/store/shiftEntry';

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

const createEmptyCell = (): ValidatedCell => ({
  value: '',
  failureMessages: [],
});

const createEmptyRow = (): ValidatedWorkerShiftRow => ({
  employeeCode: createEmptyCell(),
  lastName: createEmptyCell(),
  firstName: createEmptyCell(),
  basePayRate: createEmptyCell(),
  shiftStartDate: createEmptyCell(),
  shiftStartTime: createEmptyCell(),
  shiftEndTime: createEmptyCell(),
  casualLoading: createEmptyCell(),
});

const initialState: ShiftEntryState = {
  rows: [createEmptyRow()],
};

const {
  actions: {
    updateCellValue,
    setCellValidationMessages,
  },
  reducer,
} = createSlice({
  name: 'shiftEntry',
  initialState: initialState,
  reducers: {
    updateCellValue: (state, action: PayloadAction<UpdateCellValue>) => {
      const payload = action.payload;
      const cell = state.rows[payload.cellIdentifier.rowIndex][payload.cellIdentifier.columnId];
      cell.value = payload.value;
      cell.failureMessages = [];

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
  updateCellValue,
  setCellValidationMessages,
  reducer as shiftEntryReducer,
};
