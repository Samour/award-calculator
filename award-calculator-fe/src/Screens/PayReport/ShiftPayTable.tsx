import { useSelector } from 'react-redux';
import strings from 'strings';
import { AppState } from 'models/store';
import { ShiftPayableRow as ShiftPayableRowData } from 'models/outputs/table';
import ShiftBreakdownModal from './ShiftBreakdownModal';
import ShiftPayableRow from './ShiftPayableRow';

const selector = (state: AppState): ShiftPayableRowData[] => state.payReport.payableShifts;

const ShiftPayTable = (): JSX.Element => {
  const rowData = useSelector(selector);

  const rowElements = rowData.map((rowData, i) => (
    <ShiftPayableRow key={rowData.sourceRow} rowIndex={i} rowData={rowData} />
  ));

  return (
    <div className="ShiftPayTable">
      <ShiftBreakdownModal />
      <table className="u-full-width">
        <thead>
          <tr>
            <th>{strings.screens.payReport.tableHeadings.rowNumber}</th>
            <th>{strings.screens.payReport.tableHeadings.employeeCode}</th>
            <th>{strings.screens.payReport.tableHeadings.lastName}</th>
            <th>{strings.screens.payReport.tableHeadings.firstName}</th>
            <th>{strings.screens.payReport.tableHeadings.shiftDate}</th>
            <th>{strings.screens.payReport.tableHeadings.shiftPayable}</th>
            <th>{strings.screens.payReport.tableHeadings.details}</th>
          </tr>
        </thead>
        <tbody>
          {rowElements}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftPayTable;
