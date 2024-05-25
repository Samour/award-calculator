import { useSelector } from 'react-redux';
import { renderAsLocalTime } from 'formatters/time';
import { selectOpenPayBreakdownRow } from 'store/payReport';
import './ShiftOvertimeReasonsTable.css';

const ShiftOvertimeReasonsTable = (): JSX.Element => {
  const payableRowData = useSelector(selectOpenPayBreakdownRow);

  if (!payableRowData?.overtimeSpans.length) {
    return (<p className='ShiftOvertimeReasonsTable no-overtime'>NO_OVERTIME</p>);
  }

  const overtimeReasonRows = payableRowData.overtimeSpans.map((overtime) => (
    <tr>
      <td>{overtime.reason}</td>
      <td>{renderAsLocalTime(overtime.startTime)}</td>
      <td>{renderAsLocalTime(overtime.endTime)}</td>
    </tr>
  ));

  return (
    <table className="u-full-width">
      <thead>
        <tr>
          <th>OVERTIME_REASON</th>
          <th>EFFECTIVE_START_TIME</th>
          <th>EFFECTIVE_END_TIME</th>
        </tr>
      </thead>
      <tbody>
        {overtimeReasonRows}
      </tbody>
    </table>
  );
};

export default ShiftOvertimeReasonsTable;
