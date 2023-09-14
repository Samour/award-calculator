import { PropsWithChildren } from 'react';
import './style.css';

const Alert = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <div className="alert-container">
      {children}
    </div>
  );
};

export default Alert;
