import { useShiftTableValidator } from 'services/ShiftTableValidator';
import strings from 'strings';
import ShiftTable from './ShiftTable';
import ValidationNotification from './ValidationNotification';

const ShiftEntry = (): JSX.Element => {
  const shiftTableValidator = useShiftTableValidator();

  const onComputePayClick = () => {
    if (shiftTableValidator.validateShiftRows()) {
      window.alert('Data entry is valid - I would proceed to calculation now, except that\'s not built yet.');
    }
  };

  return (
    <div className="ShiftEntry">
      <div className="row">
        <div className="twelve columns">
          <h1>{strings.screens.shiftEntry.title}</h1>
        </div>
      </div>
      <ValidationNotification />
      <div className="row">
        <div className="twelve columns">
          <ShiftTable />
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <button className="button-primary u-pull-right"
            onClick={onComputePayClick}>{strings.screens.shiftEntry.buttons.computePay}</button>
        </div>
      </div>
    </div>
  );
};

export default ShiftEntry;
