import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { dummyWorkerPayableOutcomes } from 'dummyData';
import { WorkerPayable } from 'models/outputs/payable';
import { PayReportState } from 'models/store/payReport';

const initialState: PayReportState = {
  workers: dummyWorkerPayableOutcomes,
};

const {
  actions: { populateWorkerPayable },
  reducer,
} = createSlice({
  name: 'payReport',
  initialState,
  reducers: {
    populateWorkerPayable: (state, action: PayloadAction<WorkerPayable[]>) => {
      state.workers = action.payload;
    },
  },
});

export {
  populateWorkerPayable,
  reducer as payReportReducer
};
