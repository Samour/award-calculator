import { AppNavigation } from './navigation';
import { ShiftEntryState } from './shiftEntry';

export interface AppState {
  navigation: AppNavigation,
  shiftEntry: ShiftEntryState;
}
