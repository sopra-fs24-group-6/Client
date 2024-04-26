import React from "react";

interface LimiterProps {
  disabled?: boolean;
  value:number;
  onPlayerLimitChange: (value: number) => void;
}

const PlayerLimiter: React.FC<LimiterProps> = ({
  disabled,
  value, // Destructure the value prop
  onPlayerLimitChange,
}) => {
  const handlePlayerLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10);
    onPlayerLimitChange(selectedValue);
  };
  
  return (
    <select
      className="player-limit-selector"
      value={value} // Set the value of the select to the controlled value
      disabled={disabled}
      onChange={handlePlayerLimitChange}
    >
      {[...Array(6)].map((_, index) => (
        <option key={index} value={index + 3}>
          {index + 3}
        </option>
      ))}
    </select>
  );
};

export default PlayerLimiter;