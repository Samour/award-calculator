import { useState } from 'react';
import { ReactGrid, Column, Row, CellChange, TextCell } from '@silevis/reactgrid';
import { WorkerShiftRow } from 'models/inputs/table';
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

const convertToRows = (workerShiftRows: WorkerShiftRow[]): Row[] => {
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
      ].map((text) => ({ type: 'text', text })),
    })),
  ];

  return rows;
};

const emptyTable: WorkerShiftRow[] = [
  WorkerShiftRow.empty(),
];

export const ShiftTable = (): JSX.Element => {
  // TODO move this to Redux so that the state persists unmounting of this component
  const [workerShiftRows, setWorkerShiftRows] = useState<WorkerShiftRow[]>(emptyTable);
  const renderableRows = convertToRows(workerShiftRows);

  const onCellsChanged = (changes: CellChange[]) => {
    const updatedWorkers = workerShiftRows.map((r) => r.clone({}));
    changes.forEach((change) => {
      const update: any = {};
      update[change.columnId] = (change.newCell as TextCell).text
      updatedWorkers[change.rowId as number] = updatedWorkers[change.rowId as number].clone(update);
    });

    if (!updatedWorkers[updatedWorkers.length - 1].isEmpty()) {
      updatedWorkers.push(WorkerShiftRow.empty());
    }

    setWorkerShiftRows(
      updatedWorkers.filter((row, i) => !row.isEmpty() || i === updatedWorkers.length - 1)
    );
  };

  return (
    <ReactGrid enableRangeSelection columns={columns} rows={renderableRows} onCellsChanged={onCellsChanged} />
  );
};
