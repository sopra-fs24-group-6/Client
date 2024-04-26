import React from "react";

interface CustomButtonProps {
  text: string;
  className: string;
  onClick: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, className, onClick, disabled }) => {
  return (
    <button className={`custom-button ${className}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default CustomButton;