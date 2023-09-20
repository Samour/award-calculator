import { AppNavigation } from './navigation';
import { PayReportState } from './payReport';
import { ShiftEntryState } from './shiftEntry';

export interface AppState {
  navigation: AppNavigation,
  shiftEntry: ShiftEntryState;
  payReport: PayReportState;
}
