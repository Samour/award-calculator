import { useSelector } from 'react-redux';
import strings from 'strings';
import { selectOpenPayBreakdownRow } from 'store/payReport';
import { renderAsDollars, renderLoadingRate } from 'formatters/money';
import { renderAsLocalTime, renderDuration } from 'formatters/time';

const ShiftPayComponentTable = (): JSX.Element => {
  const payableRowData = useSelector(selectOpenPayBreakdownRow);

  const payComponentRows = payableRowData?.increments.map((payableTime, i) => (
    <tr key={i}>
      <td>{strings.loadingClassification[payableTime.classification]}</td>
      <td>{renderLoadingRate(payableTime.loading)}</td>
      <td>{renderAsLocalTime(payableTime.startTime)}</td>
      <td>{renderAsLocalTime(payableTime.endTime)}</td>
      <td>{renderDuration(payableTime.duration)}</td>
      <td>{renderAsDollars(payableTime.payableAmount, 4)}</td>
    </tr>
  ));

  return (
    <table className="u-full-width">
      <thead>
        <tr>
          <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.payType}</th>
          <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.loadingRate}</th>
          <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.effectiveStartTime}</th>
          <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.effectiveEndTime}</th>
          <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.payableDuration}</th>
          <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.payableAmount}</th>
        </tr>
      </thead>
      <tbody>
        {payComponentRows}
      </tbody>
    </table>
  );
};

export default ShiftPayComponentTable;
