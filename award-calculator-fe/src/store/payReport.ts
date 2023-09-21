import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { dummyShiftPayableRows } from 'dummyData';
import { ShiftPayableRow } from 'models/outputs/table';
import { PayReportState } from 'models/store/payReport';

const initialState: PayReportState = {
  payableShifts: dummyShiftPayableRows,
};

const {
  actions: { populatePayableRows },
  reducer,
} = createSlice({
  name: 'payReport',
  initialState,
  reducers: {
    populatePayableRows: (state, action: PayloadAction<ShiftPayableRow[]>) => {
      state.payableShifts = action.payload;
    },
  },
});

export {
  populatePayableRows,
  reducer as payReportReducer,
};
