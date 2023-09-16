import { Worker } from 'models/inputs/worker';
import { ShiftPayable } from 'models/outputs/payable';

export interface ShiftPayableRowData {
  worker: Worker;
  shift: ShiftPayable;
}
