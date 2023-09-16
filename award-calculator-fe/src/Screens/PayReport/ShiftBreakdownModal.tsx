import Modal from 'Components/Modal';
import strings from 'strings';

interface ShiftBreakdownModalProps {
  open: boolean;
  onClose: () => void;
}

const ShiftBreakdownModal = ({ open, onClose }: ShiftBreakdownModalProps): JSX.Element => {
  return (
    <Modal className="shift-pay-breakdown-modal" open={open} onClose={onClose}>
      <div className="shift-pay-breakdown-modal-content">
        <div className="row compact">
          <div className="twelve columns">
            <strong>S1065 Doe, John</strong>
          </div>
        </div>
        <div className="row">
          <div className="twelve columns">
            {strings.screens.payReport.shiftBreakdownModal.shiftDate} 14/09/2023
          </div>
        </div>
        <div className="row compact">
          <div className="twelve columns">
          {strings.screens.payReport.shiftBreakdownModal.shiftStartTime} 09:00
          </div>
        </div>
        <div className="row compact">
          <div className="twelve columns">
          {strings.screens.payReport.shiftBreakdownModal.shiftEndTime} 17:00
          </div>
        </div>
        <div className="row compact">
          <div className="twelve columns">
          {strings.screens.payReport.shiftBreakdownModal.basePayRate} $25.75
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
                <tr>
                  <td>Regular time</td>
                  <td>1</td>
                  <td>09:00</td>
                  <td>15:30</td>
                  <td>6h 30m</td>
                  <td>167.3750</td>
                </tr>
                <tr>
                  <td>Overtime (time and a half)</td>
                  <td>1.5</td>
                  <td>13:50</td>
                  <td>17:00</td>
                  <td>1h 30m</td>
                  <td>57.9375</td>
                </tr>
                <tr>
                  <td>Casual loading</td>
                  <td>0.25</td>
                  <td>09:00</td>
                  <td>17:00</td>
                  <td>8h</td>
                  <td>51.5000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row compact">
          <div className="twelve columns">
          {strings.screens.payReport.shiftBreakdownModal.totalPayable} $276.81
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShiftBreakdownModal;
