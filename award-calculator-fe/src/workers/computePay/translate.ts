import { WorkerShiftRow, translateCasualLoading, translateMonetaryAmount, translateToDateTime } from 'models/inputs/table';
import { Worker, WorkerCode } from 'models/inputs/worker';
import { WorkerPayable } from 'models/outputs/payable';
import { SerializablePayableTime, ShiftPayableRow } from 'models/outputs/table';

export const translateFromWorkerShiftRows = (shiftRows: WorkerShiftRow[]): Worker[] => {
  const workerMap: Map<WorkerCode, Worker> = new Map();

  const findOrCreateWorker = (row: WorkerShiftRow): Worker => {
    let worker = workerMap.get(row.employeeCode);
    if (!worker) {
      worker = {
        code: row.employeeCode,
        name: {
          firstName: row.firstName,
          lastName: row.lastName,
        },
        basePayRate: translateMonetaryAmount(row.basePayRate)!!,
        casualLoading: translateCasualLoading(row.casualLoading)!!,
        shifts: [],
      };
      workerMap.set(row.employeeCode, worker);
    }

    return worker;
  };

  shiftRows.forEach((row, rowIndex) => {
    const worker = findOrCreateWorker(row);
    worker.shifts.push({
      sourceRow: rowIndex,
      startTime: translateToDateTime(row.shiftStartDate, row.shiftStartTime)!!,
      endTime: translateToDateTime(row.shiftStartDate, row.shiftEndTime)!!,
    });
  });

  return Array.from(workerMap.values());
};

export const translateToShiftPayableRows = (payable: WorkerPayable): ShiftPayableRow[] =>
  payable.shifts.map((shift): ShiftPayableRow => ({
    sourceRow: shift.shift.sourceRow,
    worker: {
      code: payable.worker.code,
      name: payable.worker.name,
      basePayRate: payable.worker.basePayRate.toString(),
      casualLoading: payable.worker.casualLoading,
    },
    shift: {
      startTime: shift.shift.startTime.toString(),
      endTime: shift.shift.endTime.toString(),
    },
    increments: shift.increments.map((increment): SerializablePayableTime => ({
      startTime: increment.startTime.toString(),
      endTime: increment.endTime.toString(),
      duration: increment.duration.toString(),
      classification: increment.classification,
      loading: increment.loading.toString(),
      payableAmount: increment.payableAmount.toString(),
    })),
    overtimeSpans: shift.overtimeSpans.map((span) => ({
      startTime: span.startTime.toString(),
      endTime: span.endTime.toString(),
      reason: span.reason,
    })),
    payableAmount: shift.payableAmount.toString(),
  }));
