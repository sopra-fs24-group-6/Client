import React from 'react';

interface ButtonProps {
  label: string; 
  onClick: () => void;
  disabled?: boolean;
}

const SimpleButton: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: disabled ? 'grey' : 'blue',
        border: 'none',
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </button>
  );
};

export default SimpleButton;