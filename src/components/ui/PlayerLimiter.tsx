import React from "react";

interface LimiterProps {
  disabled?: boolean;
  onPlayerLimitChange: (value: number) => void;
}

const PlayerLimiter: React.FC<LimiterProps> = ({
  disabled,
  onPlayerLimitChange,
}) => {
  const handlePlayerLimitChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    onPlayerLimitChange(selectedValue);
  };
  return (
    <select
      className="player-limit-selector"
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
