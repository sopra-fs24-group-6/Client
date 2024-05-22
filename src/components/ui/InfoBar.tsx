import React from "react";
import "../../styles/ui/InfoBar.scss";

interface InfoBarProps {
  currentPlayer: string;
  //roundTimer: number;
  role: string;
  word: string;
  clueTimer: number;
}

const InfoBar: React.FC<InfoBarProps> = ({
  currentPlayer,
  role,
  word,
  clueTimer,
}) => {
  return (
    <div className="info-bar">
      <div>Player turn: {currentPlayer}</div>
      {/* <div>Round Time: {roundTimer}s</div> */}
      <div>Role: {role}</div>
      {role === "Villager" && <div>Word: {word}</div>}
      <div>Clue Time: {clueTimer}s</div>
    </div>
  );
};

export default InfoBar;
