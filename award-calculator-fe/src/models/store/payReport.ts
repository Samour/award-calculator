import { ShiftPayableRow } from 'models/outputs/table';

export interface ViewOptions {
  showOvertimeReasons: boolean;
}

export interface PayReportState {
  viewOptions: ViewOptions;
  payableShifts: ShiftPayableRow[];
}
