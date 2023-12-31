import { PayClassifier } from 'award/PayClassifier';
import { ClassifiedWorkedTime, WorkTimeClassification } from 'award/TimeClassifier';
import { Worker } from 'models/inputs/worker';
import { calculatePayableForIncrement } from 'models/money';
import { ClassifiedPayableTime, LoadingClassification } from 'models/outputs/payable';
import { retailAwardDetails } from '../retailAwardDetails';

export class RegularTimePayClassifier implements PayClassifier {

  classifyPayForSpan(worker: Worker, classifiedTime: ClassifiedWorkedTime[]): ClassifiedPayableTime[] {
    const loading = retailAwardDetails.loadings[WorkTimeClassification.REGULAR_TIME];
    
    return classifiedTime.filter(({ classification }) =>
      classification === WorkTimeClassification.REGULAR_TIME,
    ).map(({ startTime, endTime, duration }) => ({
      startTime,
      endTime,
      duration,
      classification: LoadingClassification.REGULAR_TIME,
      loading,
      payableAmount: calculatePayableForIncrement(worker.basePayRate, loading, duration),
    }));
  }
}
