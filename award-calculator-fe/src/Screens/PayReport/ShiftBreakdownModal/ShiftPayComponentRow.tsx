import strings from 'strings';
import { ClassifiedPayableTime } from 'models/outputs/payable';
import { renderAsDollars, renderLoadingRate } from 'formatters/money';
import { renderAsLocalTime, renderDuration } from 'formatters/time';

interface ShiftPayComponentRowProps {
  classifiedPayableTime: ClassifiedPayableTime;
}

const ShiftPayComponentRow = ({ classifiedPayableTime }: ShiftPayComponentRowProps): JSX.Element => {
  return (
    <tr>
      <td>{strings.loadingClassification[classifiedPayableTime.classification]}</td>
      <td>{renderLoadingRate(classifiedPayableTime.loading)}</td>
      <td>{renderAsLocalTime(classifiedPayableTime.startTime)}</td>
      <td>{renderAsLocalTime(classifiedPayableTime.endTime)}</td>
      <td>{renderDuration(classifiedPayableTime.duration)}</td>
      <td>{renderAsDollars(classifiedPayableTime.payableAmount, 4)}</td>
    </tr>
  );
};

export default ShiftPayComponentRow;
