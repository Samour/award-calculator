import Decimal from 'decimal.js';
import { Worker } from 'models/inputs/worker';
import { ClassifiedPayableTime, ShiftPayable, WorkerPayable } from 'models/outputs/payable';
import { MONEY_FINAL_DECIMAL_PLACES, MONEY_ROUNDING_MODE, MonetaryAmount } from 'models/money';
import { PayClassifier } from './PayClassifier';
import { TimeClassifier } from './TimeClassifier';

export class AwardPayCalculator {

  constructor(
    private readonly timeClassifier: TimeClassifier,
    private readonly payClassifiers: PayClassifier[],
  ) { }

  calculateWorkerPay(worker: Worker): WorkerPayable {
    const shiftPayables: ShiftPayable[] = this.timeClassifier.classifyShifts(worker.shifts)
      .map(({ shift, classifiedTime, classifiedOvertime }) => {
        const increments: ClassifiedPayableTime[] = this.payClassifiers.map((classifier) =>
          classifier.classifyPayForSpan(worker, classifiedTime),
        ).flat();

        const payableAmount: MonetaryAmount = increments.reduce((sum, payableTime) =>
          sum.plus(payableTime.payableAmount),
          new Decimal('0')).toDecimalPlaces(MONEY_FINAL_DECIMAL_PLACES, MONEY_ROUNDING_MODE);

        return {
          shift,
          increments,
          overtimeSpans: classifiedOvertime,
          payableAmount,
        };
      });

    const payableAmount = shiftPayables.reduce((sum, shiftPayable) =>
      sum.plus(shiftPayable.payableAmount),
      new Decimal('0'));

    return {
      worker,
      shifts: shiftPayables,
      payableAmount,
    };
  }
}
