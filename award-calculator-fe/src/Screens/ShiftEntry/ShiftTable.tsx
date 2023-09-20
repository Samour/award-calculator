import { useDispatch, useSelector } from 'react-redux';
import { ReactGrid, Column, Row, CellChange, TextCell, HeaderCell } from '@silevis/reactgrid';
import { updateCellValues } from 'store/shiftEntry';
import strings from 'strings';
import { WorkerShiftColumnName } from 'models/inputs/table';
import { ValidatedWorkerShiftRow } from 'models/store/shiftEntry';
import { AppState } from 'models/store';
import '@silevis/reactgrid/styles.css';
import './style.css';

// https://reactgrid.com/docs/4.0/2-implementing-core-features/

const ROW_NUM_COLUMN_WIDTH = 70;
const STD_COLUMN_WIDTH = 135;

const columns: Column[] = [
  { columnId: 'rowNumber', width: ROW_NUM_COLUMN_WIDTH, resizable: false },
  ...([
    'employeeCode',
    'lastName',
    'firstName',
    'basePayRate',
    'shiftStartDate',
    'shiftStartTime',
    'shiftEndTime',
    'casualLoading',
  ].map((columnId) =>
    ({ columnId, width: STD_COLUMN_WIDTH, resizable: false }),
  )),
];

const headerStyle = { background: 'rgba(191, 191, 191, 0.69)' };

const headerRow: Row = {
  rowId: 'header',
  cells: [
    { type: 'header', text: '', style: headerStyle },
    ...([
      strings.screens.shiftEntry.tableHeadings.employeeCode,
      strings.screens.shiftEntry.tableHeadings.lastName,
      strings.screens.shiftEntry.tableHeadings.firstName,
      strings.screens.shiftEntry.tableHeadings.basePayRate,
      strings.screens.shiftEntry.tableHeadings.shiftStartDate,
      strings.screens.shiftEntry.tableHeadings.shiftStartTime,
      strings.screens.shiftEntry.tableHeadings.shiftEndTime,
      strings.screens.shiftEntry.tableHeadings.casualLoading,
    ].map((text) => (
      { type: 'header', text, style: headerStyle } as HeaderCell
    ))),
  ],
};

const convertToRows = (workerShiftRows: ValidatedWorkerShiftRow[]): Row[] => {
  const rows = [
    headerRow,
    ...workerShiftRows.map<Row>((r, i) => ({
      rowId: i,
      cells: [
        {
          type: 'header',
          text: `${i + 1}`,
        },
        ...([
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
        }) as TextCell)),
      ],
    })),
  ];

  return rows;
};

const workerShiftRowsSelector = (state: AppState): ValidatedWorkerShiftRow[] =>
  state.shiftEntry.rows;

const ShiftTable = (): JSX.Element => { // TODO should make this table non-editable while calculation is in progress
  const dispatch = useDispatch();
  const workerShiftRows = useSelector(workerShiftRowsSelector);

  const renderableRows = convertToRows(workerShiftRows);

  const onCellsChanged = (changes: CellChange[]) => {
    dispatch(updateCellValues(
      changes.map((change) => ({
        cellIdentifier: {
          rowIndex: change.rowId as number,
          columnId: change.columnId as WorkerShiftColumnName,
        },
        value: (change.newCell as TextCell).text,
      })),
    ));
  };

  return (
    <ReactGrid enableRangeSelection columns={columns} rows={renderableRows} onCellsChanged={onCellsChanged} />
  );
};

export default ShiftTable;
