import { useDispatch, useSelector } from 'react-redux';
import { ReactGrid, Column, Row, CellChange, TextCell } from '@silevis/reactgrid';
import { updateCellValue } from 'store/reducers/shiftEntry';
import { WorkerShiftColumnName, WorkerShiftRow } from 'models/inputs/table';
import { ValidatedRow } from 'models/validation';
import { AppState } from 'models/store';
import '@silevis/reactgrid/styles.css';
import './style.css';

// https://reactgrid.com/docs/4.0/2-implementing-core-features/

const STD_COLUMN_WIDTH = 150

const columns: Column[] = [
  'employeeCode',
  'lastName',
  'firstName',
  'basePayRate',
  'shiftStartDate',
  'shiftStartTime',
  'shiftEndTime',
  'casualLoading',
].map((columnId) =>
  ({ columnId, width: STD_COLUMN_WIDTH, resizable: false })
);

const headerRow: Row = {
  rowId: 'header',
  cells: [
    'Employee code',
    'Last name',
    'First name',
    'Pay rate',
    'Shift start date',
    'Shift start time',
    'Shift end time',
    'Casual loading',
  ].map((text) => ({ type: 'header', text, style: { background: 'rgba(191, 191, 191, 0.69)' } })),
};

const convertToRows = (workerShiftRows: ValidatedRow[]): Row[] => {
  const rows = [
    headerRow,
    ...workerShiftRows.map<Row>((r, i) => ({
      rowId: i,
      cells: [
        r.employeeCode,
        r.lastName,
        r.firstName,
        r.basePayRate,
        r.shiftStartDate,
        r.shiftStartTime,
        r.shiftEndTime,
        r.casualLoading,
      ].map((cell) => ({
        type: 'text',
        text: cell.value,
        className: cell.failureMessages.length > 0 ? 'cell-invalid' : '',
      })),
    })),
  ];

  return rows;
};

const emptyTable: WorkerShiftRow[] = [
  WorkerShiftRow.empty(),
];

const workerShiftRowsSelector = (state: AppState): ValidatedRow[] =>
  state.shiftEntry.rows;

export const ShiftTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const workerShiftRows = useSelector(workerShiftRowsSelector);

  // TODO move this to Redux so that the state persists unmounting of this component
  const renderableRows = convertToRows(workerShiftRows);

  const onCellsChanged = (changes: CellChange[]) => {
    changes.forEach((change) => {
      dispatch(updateCellValue({
        cellIdentifier: {
          rowIndex: change.rowId as number,
          columnId: change.columnId as WorkerShiftColumnName,
        },
        value: (change.newCell as TextCell).text,
      }));
    });
  };

  return (
    <ReactGrid enableRangeSelection columns={columns} rows={renderableRows} onCellsChanged={onCellsChanged} />
  );
};
