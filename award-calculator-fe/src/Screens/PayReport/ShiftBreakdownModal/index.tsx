import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import flags from 'flags';
import strings from 'strings';
import { AppState } from 'models/store';
import { ShiftPayableRow } from 'models/outputs/table';
import { closePayBreakdownModal, selectOpenPayBreakdownRow, showOvertimeReasons } from 'store/payReport';
import { renderAsLocalDate, renderAsLocalTime } from 'formatters/time';
import { renderAsDollars } from 'formatters/money';
import LabelledSwitch from 'Components/LabelledSwitch';
import Modal from 'Components/Modal';
import ShiftPayComponentTable from './ShiftPayComponentTable';
import ShiftOvertimeReasonsTable from './ShiftOvertimeReasonsTable';

interface ShiftBreakdownModalState {
  payableRowData?: ShiftPayableRow;
  shouldShowOvertimeReasons: boolean;
}

const selectShowOvertimeReasons = (state: AppState): boolean => state.payReport.viewOptions.showOvertimeReasons;

const mapState = (
  payableRowData: ShiftPayableRow | undefined,
  shouldShowOvertimeReasons: boolean): ShiftBreakdownModalState => ({
    payableRowData,
    shouldShowOvertimeReasons,
  });

const selector = createSelector([selectOpenPayBreakdownRow, selectShowOvertimeReasons], mapState);

const ShiftBreakdownModal = (): JSX.Element => {
  const { payableRowData, shouldShowOvertimeReasons } = useSelector(selector);

  useEffect(() => {
    if (!!payableRowData) {
      (window as any).debugShiftInfo = () => console.log(payableRowData);
    } else {
      (window as any).debugShiftInfo = () => console.warn('Select a shift to display info');
    }
  }, [payableRowData]);

  const dispatch = useDispatch();
  const onShowOvertimeReasonsChange = (checked: boolean) => {
    dispatch(showOvertimeReasons(checked));
  };

  const onClose = () => dispatch(closePayBreakdownModal());

  const overtimeReasonsToggle = flags.showOvertimeReasonsToggle ? (
    <div className="six columns">
      <div className="u-pull-right">
        <LabelledSwitch
          label={strings.screens.payReport.shiftBreakdownModal.showOvertimeReasonsToggle}
          checked={shouldShowOvertimeReasons}
          onChange={onShowOvertimeReasonsChange} />
      </div>
    </div>
  ) : (<></>);

  const overtimeReasonsTable = shouldShowOvertimeReasons ? (
    <div className="row compact">
      <div className="twelve columns">
        <ShiftOvertimeReasonsTable />
      </div>
    </div>
  ) : (<></>);

  if (!payableRowData) {
    return (<></>);
  }

  return (
    <Modal className="shift-pay-breakdown-modal" open={true} backdrop={false} onClose={onClose}>
      <div className="shift-pay-breakdown-modal-content">
        <div className="row compact">
          <div className="twelve columns">
            <strong>
              {payableRowData.worker.code}&nbsp;
              {payableRowData.worker.name.lastName}, {payableRowData.worker.name.firstName}
            </strong>
          </div>
        </div>
        <div className="row compact">
          <div className="six columns">
            <div className="row">
              <div className="twelve columns">
                {strings.screens.payReport.shiftBreakdownModal.shiftDate}&nbsp;
                {renderAsLocalDate(payableRowData.shift.startTime)}
              </div>
            </div>
            <div className="row compact">
              <div className="twelve columns">
                {strings.screens.payReport.shiftBreakdownModal.shiftStartTime}&nbsp;
                {renderAsLocalTime(payableRowData.shift.startTime)}
              </div>
            </div>
            <div className="row compact">
              <div className="twelve columns">
                {strings.screens.payReport.shiftBreakdownModal.shiftEndTime}&nbsp;
                {renderAsLocalTime(payableRowData.shift.endTime)}
              </div>
            </div>
            <div className="row compact">
              <div className="twelve columns">
                {strings.screens.payReport.shiftBreakdownModal.basePayRate}&nbsp;
                ${renderAsDollars(payableRowData.worker.basePayRate)}
              </div>
            </div>
          </div>
          {overtimeReasonsToggle}
        </div>
        {overtimeReasonsTable}
        <div className="row compact">
          <div className="twelve columns">
            <ShiftPayComponentTable />
          </div>
        </div>
        <div className="row compact">
          <div className="twelve columns">
            {strings.screens.payReport.shiftBreakdownModal.totalPayable}&nbsp;
            ${renderAsDollars(payableRowData.payableAmount)}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShiftBreakdownModal;
