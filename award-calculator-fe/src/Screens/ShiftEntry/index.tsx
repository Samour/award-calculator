import { useDispatch } from 'react-redux';
import { useShiftTableValidator } from 'services/ShiftTableValidator';
import strings from 'strings';
import { navigateToScreen } from 'store/navigation';
import { Screen } from 'models/store/navigation';
import ShiftTable from './ShiftTable';
import ValidationNotification from './ValidationNotification';

const ShiftEntry = (): JSX.Element => {
  const dispatch = useDispatch();
  const validateShiftTable = useShiftTableValidator();

  const onComputePayClick = () => {
    if (validateShiftTable()) {
      dispatch(navigateToScreen(Screen.PAY_REPORT));
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
