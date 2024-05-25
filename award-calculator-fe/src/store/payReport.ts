import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ShiftPayableRow } from 'models/outputs/table';
import { AppState } from 'models/store';
import { PayReportState } from 'models/store/payReport';

const initialState: PayReportState = {
  viewOptions: {
    // TODO Maybe persist this in localstorage
    showOvertimeReasons: false,
  },
  payBreakdownModalRow: undefined,
  payableShifts: [],
};

const {
  actions: {
    showOvertimeReasons,
    openPayBreakdownModal,
    closePayBreakdownModal,
    populatePayableRows,
  },
  reducer,
} = createSlice({
  name: 'payReport',
  initialState,
  reducers: {
    showOvertimeReasons: (state, action: PayloadAction<boolean>) => {
      state.viewOptions.showOvertimeReasons = action.payload;
    },
    openPayBreakdownModal: (state, action: PayloadAction<number>) => {
      state.payBreakdownModalRow = action.payload;
    },
    closePayBreakdownModal: (state) => {
      state.payBreakdownModalRow = undefined;
    },
    populatePayableRows: (state, action: PayloadAction<ShiftPayableRow[]>) => {
      state.payableShifts = action.payload;
    },
  },
});

const selectOpenPayBreakdownRow = (state: AppState): ShiftPayableRow | undefined => {
  const openRowIndex = state.payReport.payBreakdownModalRow;
  return openRowIndex === undefined ? undefined : state.payReport.payableShifts[openRowIndex];
};

export {
  showOvertimeReasons,
  openPayBreakdownModal,
  closePayBreakdownModal,
  populatePayableRows,
  reducer as payReportReducer,
  selectOpenPayBreakdownRow,
};
