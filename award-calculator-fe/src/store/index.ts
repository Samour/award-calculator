import { configureStore } from '@reduxjs/toolkit';
import { shiftEntryReducer } from './shiftEntry';
import { payReportViewOptionsPersistenceMiddleware, shiftWorkerTablePersistenceMiddleware } from './persistence';
import { navigationReducer } from './navigation';
import { payReportReducer } from './payReport';

export default configureStore({
  reducer: {
    shiftEntry: shiftEntryReducer,
    navigation: navigationReducer,
    payReport: payReportReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    shiftWorkerTablePersistenceMiddleware(),
    payReportViewOptionsPersistenceMiddleware(),
  ]),
});
