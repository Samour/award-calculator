import { useSelector } from 'react-redux';
import strings from 'strings';
import { selectOpenPayBreakdownRow } from 'store/payReport';
import ShiftPayComponentRow from './ShiftPayComponentRow';

const ShiftPayComponentTable = (): JSX.Element => {
  const payableRowData = useSelector(selectOpenPayBreakdownRow);

  if (!payableRowData) {
    return (<></>);
  }

  const payComponentRows = payableRowData.increments.map((payableTime, i) => (
    <ShiftPayComponentRow key={i} classifiedPayableTime={payableTime} />
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
