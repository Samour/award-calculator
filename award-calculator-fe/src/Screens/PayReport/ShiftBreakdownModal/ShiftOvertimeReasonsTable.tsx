import strings from 'strings';
import { useSelector } from 'react-redux';
import { renderAsLocalTime } from 'formatters/time';
import { selectOpenPayBreakdownRow } from 'store/payReport';
import './ShiftOvertimeReasonsTable.css';

const overtimeReasonsStrings = strings.screens.payReport.shiftBreakdownModal.overtimeReasons;

const ShiftOvertimeReasonsTable = (): JSX.Element => {
  const payableRowData = useSelector(selectOpenPayBreakdownRow);

  if (!payableRowData?.overtimeSpans.length) {
    return (<p className='ShiftOvertimeReasonsTable no-overtime'>{overtimeReasonsStrings.noOvertime}</p>);
  }

  const overtimeReasonRows = payableRowData.overtimeSpans.map((overtime, i) => (
    <tr key={i}>
      <td>{strings.overtimeReason[overtime.reason]}</td>
      <td>{renderAsLocalTime(overtime.startTime)}</td>
      <td>{renderAsLocalTime(overtime.endTime)}</td>
    </tr>
  ));

  return (
    <table className="u-full-width">
      <thead>
        <tr>
          <th>{overtimeReasonsStrings.tableHeadings.overtimeReason}</th>
          <th>{overtimeReasonsStrings.tableHeadings.effectiveStartTime}</th>
          <th>{overtimeReasonsStrings.tableHeadings.effectiveEndTime}</th>
        </tr>
      </thead>
      <tbody>
        {overtimeReasonRows}
      </tbody>
    </table>
  );
};

export default ShiftOvertimeReasonsTable;
