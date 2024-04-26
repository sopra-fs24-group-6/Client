import React from "react";

interface LimiterProps {
  disabled?: boolean;
  value: number;
  onRoundLimitChange: (value: number) => void;
}

const RoundLimiter: React.FC<LimiterProps> = ({
  disabled,
  value,
  onRoundLimitChange,
}) => {
  const handleRoundLimitChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    onRoundLimitChange(selectedValue);
  };
  
  return (
    <select
      className="Round-limit-selector"
      value={value}
      disabled={disabled}
      onChange={handleRoundLimitChange}
    >
      {[...Array(6)].map((_, index) => (
        <option key={index} value={index + 3}>
          {index + 3}
        </option>
      ))}
    </select>
  );
};

export default RoundLimiter;