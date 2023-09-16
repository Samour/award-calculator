import { renderAsDollars } from 'formatters/money';
import { renderAsLocalDate } from 'formatters/time';
import { Worker } from 'models/inputs/worker';
import { ShiftPayable } from 'models/outputs/payable';

export interface ShiftPayableRowData {
  worker: Worker;
  shift: ShiftPayable;
}

interface ShiftPayableRowProps {
  rowData: ShiftPayableRowData;
  onShowDetails: () => void;
}

const ShiftPayableRow = ({ rowData, onShowDetails }: ShiftPayableRowProps): JSX.Element => {
  return (
    <tr>
      <td>{rowData.worker.code}</td>
      <td>{rowData.worker.name.lastName}</td>
      <td>{rowData.worker.name.firstName}</td>
      <td>{renderAsLocalDate(rowData.shift.shift.startTime)}</td>
      <td>${renderAsDollars(rowData.shift.payableAmount)}</td>
      <td>
        <button className="round" onClick={onShowDetails}>?</button>
      </td>
    </tr>
  );
};

export default ShiftPayableRow;
