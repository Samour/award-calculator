import { useDispatch } from 'react-redux';
import { renderAsDollars } from 'formatters/money';
import { renderAsLocalDate } from 'formatters/time';
import { ShiftPayableRow as ShiftPayableRowData } from 'models/outputs/table';
import { openPayBreakdownModal } from 'store/payReport';

interface ShiftPayableRowProps {
  rowIndex: number;
  rowData: ShiftPayableRowData;
}

const ShiftPayableRow = ({ rowIndex, rowData }: ShiftPayableRowProps): JSX.Element => {
  const dispatch = useDispatch();
  const onShowDetails = () => dispatch(openPayBreakdownModal(rowIndex));

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
