import React from "react";
import styles from "../../styles/ui/WoodButton.module.scss";

interface CustomButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const WoodButton: React.FC<CustomButtonProps> = ({ text, className = "", onClick, disabled = false }) => {
  return (
    <button
      className={`${styles.button} ${className.split(" ").map(cls => styles[cls]).join(" ")}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default WoodButton;
