import { PayClassifier } from 'award/PayClassifier';
import { ClassifiedWorkedTime, WorkTimeClassification } from 'award/TimeClassifier';
import { Worker } from 'models/inputs/worker';
import { MONEY_INCREMENTAL_DECIMLAL_PLACES, MONEY_ROUNDING_MODE } from 'models/money';
import { ClassifiedPayableTime, LoadingClassification } from 'models/outputs/payable';
import { MINUTES_IN_HOUR } from 'models/time';
import { retailAwardDetails } from '../retailAwardDetails';

export class RegularTimePayClassifier implements PayClassifier {

  classifyPayForSpan(worker: Worker, classifiedTime: ClassifiedWorkedTime[]): ClassifiedPayableTime[] {
    return classifiedTime.filter(({ classification }) =>
      classification === WorkTimeClassification.REGULAR_TIME,
    ).map(({ startTime, endTime, duration }) => ({
      startTime,
      endTime,
      duration,
      classification: LoadingClassification.REGULAR_TIME,
      loading: retailAwardDetails.loadings[WorkTimeClassification.REGULAR_TIME],
      payableAmount: duration.times(worker.basePayRate)
        .times(retailAwardDetails.loadings[WorkTimeClassification.REGULAR_TIME])
        .div(MINUTES_IN_HOUR)
        .toDecimalPlaces(MONEY_INCREMENTAL_DECIMLAL_PLACES, MONEY_ROUNDING_MODE),
    }));
  }
}
