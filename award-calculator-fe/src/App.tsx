import { useSelector } from 'react-redux';
import { AppState } from 'models/store';
import { Screen } from 'models/store/navigation';
import Alert from 'Components/Alert';
import PayReport from 'Screens/PayReport';
import ShiftEntry from 'Screens/ShiftEntry';
import './App.css';

const navigationScreenSelector = (state: AppState): Screen => state.navigation.screen;

const App = (): JSX.Element => {
  const screen = useSelector(navigationScreenSelector);

  const selectScreen = (): JSX.Element => {
    if (screen === Screen.SHIFT_ENTRY) {
      return <ShiftEntry/>;
    } else if (screen === Screen.PAY_REPORT) {
      return <PayReport/>;
    } else {
      return (
        <Alert>NAVIGATION ERROR</Alert>
      );
    }
  };

  return (
    <div className="App container">
      {selectScreen()}
    </div>
  );
};

export default App;
