import Switch from 'react-switch';
import './style.css';

interface LabelledSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const LabelledSwitch = ({ label, checked, onChange }: LabelledSwitchProps): JSX.Element => {
  return (
    <label className='LabelledSwitch'>
      <span className='label-text'>{label}&nbsp;</span>
      <Switch
        checked={checked}
        onChange={onChange}
        checkedIcon={false}
        uncheckedIcon={false}
        height={20}
        width={40}
        onColor='#5799dc' />
    </label>
  );
};

export default LabelledSwitch;
