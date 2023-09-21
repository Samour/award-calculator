import { PayClassifier } from 'award/PayClassifier';
import { ClassifiedWorkedTime, WorkTimeClassification } from 'award/TimeClassifier';
import { Worker } from 'models/inputs/worker';
import { ClassifiedPayableTime, LoadingClassification } from 'models/outputs/payable';
import { calculatePayableForIncrement } from 'models/money';
import { retailAwardDetails } from '../retailAwardDetails';

export class WeekendPenaltyPayClassifier implements PayClassifier {

  classifyPayForSpan(worker: Worker, classifiedTime: ClassifiedWorkedTime[]): ClassifiedPayableTime[] {
    if (classifiedTime.length === 0) {
      return [];
    }

    // Assumption: shift does not span across dates
    const dayOfWeek = classifiedTime[0].startTime.toLocalDate().dayOfWeek();
    const loading = retailAwardDetails.loadings[LoadingClassification.WEEKEND_PENALTY][dayOfWeek.name()];
    if (!loading) {
      return [];
    }

    return classifiedTime.filter(({ classification }) =>
      classification === WorkTimeClassification.REGULAR_TIME,
    ).map(({ startTime, endTime, duration }) => ({
      startTime,
      endTime,
      duration,
      classification: LoadingClassification.WEEKEND_PENALTY,
      loading,
      payableAmount: calculatePayableForIncrement(worker.basePayRate, loading, duration),
    }));
  }
}
