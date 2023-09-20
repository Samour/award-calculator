import { useEffect, useRef } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import strings from 'strings';
import { AppState } from 'models/store';
import { ValidatedWorkerShiftRow } from 'models/store/shiftEntry';
import Alert from 'Components/Alert';

const tableRowsSelector = (state: AppState): ValidatedWorkerShiftRow[] =>
  state.shiftEntry.rows;

interface ValidationMessage {
  rowNumber: number;
  message: string;
}

const validationMessagesMapper = (rows: ValidatedWorkerShiftRow[]): ValidationMessage[] =>
  rows.map((row, rowIndex) => [
    row.employeeCode,
    row.lastName,
    row.firstName,
    row.basePayRate,
    row.shiftStartDate,
    row.shiftStartTime,
    row.shiftEndTime,
    row.casualLoading,
  ].map((cell) =>
    cell.failureMessages.map((message) => ({
      rowNumber: rowIndex + 1,
      message,
    })),
  ),
  ).flat(2);

const validationMessagesSelector = createSelector([tableRowsSelector], validationMessagesMapper);

interface ValidationNotificationProps {
  scrollNonce?: string;
}

const ValidationNotification = ({ scrollNonce }: ValidationNotificationProps): JSX.Element => {
  const validationMessages = useSelector(validationMessagesSelector);
  const visible = validationMessages.length > 0;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      ref.current?.scrollIntoView();
    }
  }, [visible, scrollNonce]);

  const validationMessageElements = validationMessages.map(({ rowNumber, message }, i) => (
    <li key={i}>Row {rowNumber}: {message}</li>
  ));

  if (!visible) {
    return (<></>);
  } else {
    return (
      <div ref={ref} className="row">
        <div className="two columns">&nbsp;</div>
        <div className="eight columns">
          <Alert>
            <div className="validation-alert">
              <div className="row">
                <div className="twelve columns">
                  {strings.screens.shiftEntry.validation.message}
                </div>
              </div>
              <div className="row">
                <div className="twelve columns">
                  <strong>{strings.screens.shiftEntry.validation.subtitle(validationMessages.length)}</strong>
                </div>
              </div>
              <div className="row compact">
                <div className="one columns">&nbsp;</div>
                <div className="ten columns">
                  <ul className="validation-messages">
                    {validationMessageElements}
                  </ul>
                </div>
              </div>
            </div>
          </Alert>
        </div>
      </div>
    );
  }
};

export default ValidationNotification;
