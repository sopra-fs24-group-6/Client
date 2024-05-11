import React from "react";
import "../../styles/ui/TimerDisplay.scss";

interface TimerDisplayProps {
  timer: number;
  label: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer, label }) => {
  return (
    <p className={timer < 10 ? "pulsating-red" : ""}>
      {label}: {timer}s
    </p>
  );
};

export default TimerDisplay;