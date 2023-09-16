import Modal from 'Components/Modal';
import strings from 'strings';
import { ShiftPayableRowData } from './ShiftPayableRowData';
import { renderAsLocalDate, renderAsLocalTime } from 'formatters/time';
import { renderAsDollars } from 'formatters/money';
import ShiftPayComponentRow from './ShiftPayComponentRow';

interface ShiftBreakdownModalProps {
  open: boolean;
  payableRowData?: ShiftPayableRowData;
  onClose: () => void;
}

const ShiftBreakdownModal = ({ open, payableRowData, onClose }: ShiftBreakdownModalProps): JSX.Element => {
  if (!payableRowData) {
    return (<></>);
  }

  const payComponentRows = payableRowData.shift.increments.map((payableTime) => (
    <ShiftPayComponentRow classifiedPayableTime={payableTime} />
  ));

  return (
    <Modal className="shift-pay-breakdown-modal" open={open} onClose={onClose}>
      <div className="shift-pay-breakdown-modal-content">
        <div className="row compact">
          <div className="twelve columns">
            <strong>
              {payableRowData.worker.code}&nbsp;
              {payableRowData.worker.name.lastName}, {payableRowData.worker.name.firstName}
            </strong>
          </div>
        </div>
        <div className="row">
          <div className="twelve columns">
            {strings.screens.payReport.shiftBreakdownModal.shiftDate}&nbsp;
            {renderAsLocalDate(payableRowData.shift.shift.startTime)}
          </div>
        </div>
        <div className="row compact">
          <div className="twelve columns">
            {strings.screens.payReport.shiftBreakdownModal.shiftStartTime}&nbsp;
            {renderAsLocalTime(payableRowData.shift.shift.startTime)}
          </div>
        </div>
        <div className="row compact">
          <div className="twelve columns">
            {strings.screens.payReport.shiftBreakdownModal.shiftEndTime}&nbsp;
            {renderAsLocalTime(payableRowData.shift.shift.endTime)}
          </div>
        </div>
        <div className="row compact">
          <div className="twelve columns">
            {strings.screens.payReport.shiftBreakdownModal.basePayRate}&nbsp;
            ${renderAsDollars(payableRowData.shift.payableAmount)}
          </div>
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
            ${renderAsDollars(payableRowData.shift.payableAmount)}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShiftBreakdownModal;
