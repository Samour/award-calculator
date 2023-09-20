import { useState } from 'react';
import { useSelector } from 'react-redux';
import strings from 'strings';
import { WorkerPayable } from 'models/outputs/payable';
import { AppState } from 'models/store';
import { ShiftPayableRowData } from './ShiftPayableRowData';
import ShiftBreakdownModal from './ShiftBreakdownModal';
import ShiftPayableRow from './ShiftPayableRow';

const sortBySourceRow = (a: ShiftPayableRowData, b: ShiftPayableRowData) => a.shift.shift.sourceRow
  - b.shift.shift.sourceRow;

const selector = (state: AppState): WorkerPayable[] => state.payReport.workers;

const ShiftPayTable = (): JSX.Element => {
  const workerPayables = useSelector(selector);
  const [activeShiftBreakdown, setActiveShiftBreakdown] = useState<ShiftPayableRowData>();

  const closeModal = () => setActiveShiftBreakdown(undefined);

  const rowData: ShiftPayableRowData[] = workerPayables.flatMap((workerPayable) =>
    workerPayable.shifts.map((shift) => ({
      worker: workerPayable.worker,
      shift,
    })),
  );
  rowData.sort(sortBySourceRow);

  const rowElements = rowData.map((rowData) => (
    <ShiftPayableRow key={rowData.shift.shift.sourceRow} rowData={rowData}
      onShowDetails={() => setActiveShiftBreakdown(rowData)} />
  ));

  return (
    <div className="ShiftPayTable">
      <ShiftBreakdownModal open={!!activeShiftBreakdown} payableRowData={activeShiftBreakdown}
        onClose={closeModal} />
      <table className="u-full-width">
        <thead>
          <tr>
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
