import { ShiftTable } from './ShiftTable';

export const ShiftEntry = (): JSX.Element => {
  return (
    <>
      <div className="row">
        <div className="twelve columns">
          <h1>View/Edit Hours</h1>
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <ShiftTable />
        </div>
      </div>
    </>
  );
};
