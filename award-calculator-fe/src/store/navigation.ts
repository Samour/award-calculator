import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppNavigation, Screen } from 'models/store/navigation';

const initialState: AppNavigation = {
  screen: Screen.SHIFT_ENTRY,
};

const {
  actions: { navigateToScreen },
  reducer,
} = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigateToScreen: (state, action: PayloadAction<Screen>) => {
      state.screen = action.payload;
    },
  },
});

export {
  navigateToScreen,
  reducer as navigationReducer,
};
