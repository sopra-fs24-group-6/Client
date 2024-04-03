import React from "react";

interface LimiterProps {
  disabled?: boolean;
}

const RoundLimiter: React.FC<LimiterProps> = ({ disabled }) => {
  return (
    <select className="Round-limit-selector" disabled={disabled}>
      {[...Array(6)].map((_, index) => (
        <option key={index} value={index + 3}>
          {index + 3}
        </option>
      ))}
    </select>
  );
};

export default RoundLimiter;
