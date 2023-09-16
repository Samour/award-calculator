import { useState } from 'react';
import strings from 'strings';
import ShiftBreakdownModal from './ShiftBreakdownModal';

const ShiftPayTable = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="ShiftPayTable">
      <ShiftBreakdownModal open={modalOpen} onClose={closeModal} />
      <table className="u-full-width">
        <thead>
          <tr>
            <th>{strings.screens.payReport.tableHeadings.employeeCode}</th>
            <th>{strings.screens.payReport.tableHeadings.lastName}</th>
            <th>{strings.screens.payReport.tableHeadings.firstName}</th>
            <th>{strings.screens.payReport.tableHeadings.shiftDate}</th>
            <th>{strings.screens.payReport.tableHeadings.shiftPayable}</th>
            <th>{strings.screens.payReport.tableHeadings.details}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>S1065</td>
            <td>Doe</td>
            <td>John</td>
            <td>14/09/2023</td>
            <td>$276.81</td>
            <td>
              <button className="round" onClick={openModal}>?</button>
            </td>
          </tr>
          <tr>
            <td>S1065</td>
            <td>Doe</td>
            <td>John</td>
            <td>15/09/2023</td>
            <td>$276.81</td>
            <td>
              <button className="round" onClick={openModal}>?</button>
            </td>
          </tr>
          <tr>
            <td>S1066</td>
            <td>Smith</td>
            <td>Matt</td>
            <td>14/09/2023</td>
            <td>$267.19</td>
            <td>
              <button className="round" onClick={openModal}>?</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ShiftPayTable;
