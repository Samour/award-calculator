import { configureStore } from '@reduxjs/toolkit';
import { shiftEntryReducer } from './shiftEntry';
import { shiftWorkerTablePersistenceMiddleware } from './persistence';

export default configureStore({
  reducer: {
    shiftEntry: shiftEntryReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(shiftWorkerTablePersistenceMiddleware()),
});
