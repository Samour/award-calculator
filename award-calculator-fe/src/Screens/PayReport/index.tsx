import { Screen } from 'models/store/navigation';
import { useDispatch } from 'react-redux';
import { navigateToScreen } from 'store/navigation';
import strings from 'strings';
import ShiftPayTable from './ShiftPayTable';
import './style.css';

const PayReport = (): JSX.Element => {
  const dispatch = useDispatch();

  const onBackClick = () => {
    dispatch(navigateToScreen(Screen.SHIFT_ENTRY));
  };

  return (
    <div className="PayReport">
      <div className="row">
        <div className="twelve columns">
          <h1>{strings.screens.payReport.title}</h1>
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <ShiftPayTable/>
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <button className="u-pull-left" onClick={onBackClick}>
            {strings.screens.payReport.buttons.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayReport;
