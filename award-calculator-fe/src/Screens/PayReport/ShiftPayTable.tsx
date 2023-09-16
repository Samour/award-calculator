import { useState } from 'react';
import strings from 'strings';
import ShiftBreakdownModal from './ShiftBreakdownModal';
import ShiftPayableRow, { ShiftPayableRowData } from './ShiftPayableRow';
import { dummyWorkerPayableOutcomes } from 'dummyData';

const sortBySourceRow = (a: ShiftPayableRowData, b: ShiftPayableRowData) => a.shift.shift.sourceRow
  - b.shift.shift.sourceRow;

const ShiftPayTable = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const rowData: ShiftPayableRowData[] = dummyWorkerPayableOutcomes.flatMap((workerPayable) =>
    workerPayable.shifts.map((shift) => ({
      worker: workerPayable.worker,
      shift,
    }))
  );
  rowData.sort(sortBySourceRow);

  const rowElements = rowData.map((rowData) => (
    <ShiftPayableRow key={rowData.shift.shift.sourceRow} rowData={rowData} onShowDetails={openModal} />
  ));

  return (
    <div className="ShiftPayTable">
      <ShiftBreakdownModal open={modalOpen} onClose={closeModal} />
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
