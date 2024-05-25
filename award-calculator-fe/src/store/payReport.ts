import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ShiftPayableRow } from 'models/outputs/table';
import { PayReportState } from 'models/store/payReport';

const initialState: PayReportState = {
  viewOptions: {
    showOvertimeReasons: false,
  },
  payableShifts: [],
};

const {
  actions: { 
    showOvertimeReasons,
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
    populatePayableRows: (state, action: PayloadAction<ShiftPayableRow[]>) => {
      state.payableShifts = action.payload;
    },
  },
});

export {
  showOvertimeReasons,
  populatePayableRows,
  reducer as payReportReducer,
};
