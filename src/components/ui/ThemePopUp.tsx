import React, { useState } from "react";
import "../../styles/ui/ThemePopUp.scss";

interface ThemePopUpProps {
  themes: string[];
  selectedThemes: string[];
  onSelect: (themes: string[]) => void;
  onClose: () => void;
}

const ThemePopUp: React.FC<ThemePopUpProps> = ({
  themes,
  selectedThemes: initialSelectedThemes,
  onSelect,
  onClose,
}) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(initialSelectedThemes);

  const toggle = (theme: string) => {
    setSelectedThemes((prevSelectedThemes) => {
      if (prevSelectedThemes.includes(theme)) {
        return prevSelectedThemes.filter((t) => t !== theme);
      } else {
        return [...prevSelectedThemes, theme];
      }
    });
  };

  const onConfirm = () => {
    onSelect(selectedThemes);
    onClose();
  };

  return (
    <div className="theme-selector-popup">
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="popup-content">
        <button onClick={onClose}>Close</button>
        {themes.map((theme) => (
          <div key={theme}>
            <input
              type="checkbox"
              id={theme}
              name={theme}
              value={theme}
              checked={selectedThemes.includes(theme)}
              onChange={() => toggle(theme)}
            />
            <label htmlFor={theme}>{theme}</label>
          </div>
        ))}
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default ThemePopUp;