import React, { useState, useEffect } from "react";
import "../../styles/ui/ThemePopUp.scss";
import CustomButton from "./CustomButton";

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

  useEffect(() => {
    setSelectedThemes(initialSelectedThemes);
  }, [initialSelectedThemes]);

  const toggleTheme = (theme: string) => {
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
        <CustomButton text="Close" className="small hover-red" onClick={onClose}/>
        <div className="theme-tags-container">
          {selectedThemes.map((theme) => (
            <span key={theme} className="theme-tag">
              {theme}
              <button onClick={() => toggleTheme(theme)} className="remove-theme">x</button>
            </span>
          ))}
        </div>
        {themes.map((theme) => (
          <div key={theme} className="theme-chip">
            <input
              type="checkbox"
              id={theme}
              name={theme}
              value={theme}
              checked={selectedThemes.includes(theme)}
              onChange={() => toggleTheme(theme)}
              style={{ display: "none" }}
            />
            <label htmlFor={theme} className={`chip ${selectedThemes.includes(theme) ? "selected" : ""}`}>
              {theme}
            </label>
          </div>
        ))}
        <CustomButton text="Confirm" className="small hover-green" onClick={onConfirm}/>
      </div>
    </div>
  );
};

export default ThemePopUp;