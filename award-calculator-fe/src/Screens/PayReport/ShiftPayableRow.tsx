import { renderAsDollars } from 'formatters/money';
import { renderAsLocalDate } from 'formatters/time';
import { ShiftPayableRow as ShiftPayableRowData } from 'models/outputs/table';

interface ShiftPayableRowProps {
  rowData: ShiftPayableRowData;
  onShowDetails: () => void;
}

const ShiftPayableRow = ({ rowData, onShowDetails }: ShiftPayableRowProps): JSX.Element => {
  return (
    <tr>
      <td>{rowData.sourceRow + 1}</td>
      <td>{rowData.worker.code}</td>
      <td>{rowData.worker.name.lastName}</td>
      <td>{rowData.worker.name.firstName}</td>
      <td>{renderAsLocalDate(rowData.shift.startTime)}</td>
      <td>${renderAsDollars(rowData.payableAmount)}</td>
      <td>
        <button className="round" onClick={onShowDetails}>?</button>
      </td>
    </tr>
  );
};

export default ShiftPayableRow;
