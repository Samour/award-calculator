import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ShiftPayableRow } from 'models/outputs/table';
import { AppState } from 'models/store';
import { PayReportState, ViewOptions } from 'models/store/payReport';
import { PAY_REPORT_VIEW_OPTIONS_LS_KEY } from './persistence';

const loadViewOptions = (): ViewOptions => {
  const defaultViewOptions: ViewOptions = {
    showOvertimeReasons: false,
  };
  const viewOptionsJson = localStorage.getItem(PAY_REPORT_VIEW_OPTIONS_LS_KEY) || '{}';
  const viewOptionsFromLs: Partial<ViewOptions> = JSON.parse(viewOptionsJson);

  return {
    ...defaultViewOptions,
    ...viewOptionsFromLs,
  };
};

const initialState: PayReportState = {
  viewOptions: loadViewOptions(),
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
