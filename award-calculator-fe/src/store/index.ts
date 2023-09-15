import { configureStore } from '@reduxjs/toolkit';
import { shiftEntryReducer } from './shiftEntry';
import { shiftWorkerTablePersistenceMiddleware } from './persistence';
import { navigationReducer } from './navigation';

export default configureStore({
  reducer: {
    shiftEntry: shiftEntryReducer,
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(shiftWorkerTablePersistenceMiddleware()),
});
