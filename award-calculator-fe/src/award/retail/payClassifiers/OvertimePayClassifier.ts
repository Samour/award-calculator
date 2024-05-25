import { LocalDate } from '@js-joda/core';
import Decimal from 'decimal.js';
import { PayClassifier } from 'award/PayClassifier';
import { ClassifiedWorkedTime, WorkTimeClassification } from 'award/TimeClassifier';
import { Worker } from 'models/inputs/worker';
import { ClassifiedPayableTime, LoadingClassification } from 'models/outputs/payable';
import { IncrementalMinuteDuration } from 'models/time';
import { calculatePayableForIncrement } from 'models/money';
import { retailAwardDetails } from '../retailAwardDetails';

export class OvertimePayClassifier implements PayClassifier {

  private currentDay?: LocalDate;
  private currentDayOTCount: IncrementalMinuteDuration = new Decimal('0');

  classifyPayForSpan(worker: Worker, classifiedTime: ClassifiedWorkedTime[]): ClassifiedPayableTime[] {
    return classifiedTime.filter(({ classification }) =>
      classification === WorkTimeClassification.OVERTIME,
    ).map(({ startTime, endTime, duration }) => {
      // Assumption: shift does not cross days
      if (!this.currentDay?.equals(startTime.toLocalDate())) {
        this.currentDay = startTime.toLocalDate();
        this.currentDayOTCount = new Decimal('0');
      }

      const overtimePayable: ClassifiedPayableTime[] = [];
      const dtThreshold = retailAwardDetails.doubleTimeThresholds[startTime.dayOfWeek().name()];
      const remainingTimeAndHalf = Decimal.max(dtThreshold.minus(this.currentDayOTCount), new Decimal('0'));
      const timeAndHalfAllocation = Decimal.min(remainingTimeAndHalf, duration);
      if (timeAndHalfAllocation.greaterThan(0)) {
        const loading = retailAwardDetails.loadings[LoadingClassification.TIME_AND_A_HALF];
        overtimePayable.push({
          startTime,
          endTime: startTime.plusMinutes(timeAndHalfAllocation.toNumber()),
          duration: timeAndHalfAllocation,
          classification: LoadingClassification.TIME_AND_A_HALF,
          loading,
          payableAmount: calculatePayableForIncrement(worker.basePayRate, loading, timeAndHalfAllocation),
        });
      }
      if (duration.greaterThan(timeAndHalfAllocation)) {
        const dtDuration = duration.minus(timeAndHalfAllocation);
        const loading = retailAwardDetails.loadings[LoadingClassification.DOUBLE_TIME];
        overtimePayable.push({
          startTime: startTime.plusMinutes(timeAndHalfAllocation.toNumber()),
          endTime,
          duration: dtDuration,
          classification: LoadingClassification.DOUBLE_TIME,
          loading,
          payableAmount: calculatePayableForIncrement(worker.basePayRate, loading, dtDuration),
        });
      }

      this.currentDayOTCount = this.currentDayOTCount.plus(duration);

      return overtimePayable;
    }).flat();
  }
}
