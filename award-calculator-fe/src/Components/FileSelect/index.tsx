import { ChangeEvent, useRef } from 'react';

interface FileSelectProps {
  label: string;
  className?: string;
  onSelect: (file: File) => void;
}

const FileSelect = ({ label, className, onSelect }: FileSelectProps): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    ref.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      onSelect(file);
    }
  };

  return (
    <>
      <input ref={ref} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
      <button className={className} onClick={handleClick}>{label}</button>
    </>
  );
};

export default FileSelect;
