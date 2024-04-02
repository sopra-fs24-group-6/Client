import React from "react";
import "../../styles/ui/AppBody.scss"; // Adjust the path as necessary

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({ min, max, value, onChange, disabled }) => {
  return (
    <>
      <span className="slider-value">{value}</span>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </>
  );
};

export default Slider;