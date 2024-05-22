import React from "react";

interface Option {
  label: string;
  value: string | boolean;
}

interface NESRadioButtonProps {
  name: string;
  options: Option[];
  defaultValue?: string | boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const NESRadioButton: React.FC<NESRadioButtonProps> = ({
  name,
  options,
  defaultValue,
  onChange,
  disabled,
}) => {
  return (
    <div>
      {options.map((option) => (
        <label key={option.value.toString()}>
          <input
            type="radio"
            className="nes-radio"
            name={name}
            value={option.value.toString()}
            defaultChecked={defaultValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default NESRadioButton;