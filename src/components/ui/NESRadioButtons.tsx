import React from "react";
import PropTypes from "prop-types";

const NESRadioButton = ({ name, options, defaultValue }) => {
  return (
    <div>
      {options.map((option) => (
        <label key={option.value}>
          <input 
            type="radio" 
            className="nes-radio" 
            name={name} 
            value={option.value} 
            defaultChecked={defaultValue === option.value}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

NESRadioButton.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultValue: PropTypes.string,
};

export default NESRadioButton;