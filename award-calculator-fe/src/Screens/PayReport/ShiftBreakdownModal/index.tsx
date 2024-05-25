import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import flags from 'flags';
import strings from 'strings';
import { AppState } from 'models/store';
import { ShiftPayableRow } from 'models/outputs/table';
import { showOvertimeReasons } from 'store/payReport';
import { renderAsLocalDate, renderAsLocalTime } from 'formatters/time';
import { renderAsDollars } from 'formatters/money';
import LabelledSwitch from 'Components/LabelledSwitch';
import Modal from 'Components/Modal';
import ShiftPayComponentRow from './ShiftPayComponentRow';

interface ShiftBreakdownModalProps {
  open: boolean;
  payableRowData?: ShiftPayableRow;
  onClose: () => void;
}

const selector = (state: AppState): boolean => state.payReport.viewOptions.showOvertimeReasons;

const ShiftBreakdownModal = ({ open, payableRowData, onClose }: ShiftBreakdownModalProps): JSX.Element => {
  useEffect(() => {
    if (!!payableRowData) {
      (window as any).debugShiftInfo = () => console.log(payableRowData);
    } else {
      (window as any).debugShiftInfo = () => console.warn('Select a shift to display info');
    }
  }, [payableRowData]);

  const shouldShowOvertimeReasons = useSelector(selector);
  const dispatch = useDispatch();
  const onShowOvertimeReasonsChange = (checked: boolean) => {
    dispatch(showOvertimeReasons(checked));
  };

  const overtimeReasonsToggle = flags.showOvertimeReasonsToggle ? (
    <div className="six columns">
      <LabelledSwitch
        label='SHOW_OVERTIME_REASONS'
        checked={shouldShowOvertimeReasons}
        onChange={onShowOvertimeReasonsChange} />
    </div>
  ) : (<></>);

  if (!payableRowData) {
    return (<></>);
  }

  const payComponentRows = payableRowData.increments.map((payableTime, i) => (
    <ShiftPayComponentRow key={i} classifiedPayableTime={payableTime} />
  ));

  return (
    <Modal className="shift-pay-breakdown-modal" open={open} backdrop={false} onClose={onClose}>
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
        <div className="row compact">
          <div className="twelve columns">
            <table className="u-full-width">
              <thead>
                <tr>
                  <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.payType}</th>
                  <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.loadingRate}</th>
                  <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.effectiveStartTime}</th>
                  <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.effectiveEndTime}</th>
                  <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.payableDuration}</th>
                  <th>{strings.screens.payReport.shiftBreakdownModal.tableHeadings.payableAmount}</th>
                </tr>
              </thead>
              <tbody>
                {payComponentRows}
              </tbody>
            </table>
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
