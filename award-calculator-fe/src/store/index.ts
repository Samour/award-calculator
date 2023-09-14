import { configureStore } from '@reduxjs/toolkit';
import { AppState } from 'models/store';
import { shiftEntryReducer } from './reducers/shiftEntry';

export default configureStore<AppState>({
  reducer: {
    shiftEntry: shiftEntryReducer,
  },
});
