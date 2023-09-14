import { ShiftTimestamp } from 'models/time';

export interface WorkerShift {
  sourceRow: number; // Track row number from the original input table
  startTime: ShiftTimestamp;
  endTime: ShiftTimestamp;
}
