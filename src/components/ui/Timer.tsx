import React, { useState, useRef, useEffect } from "react";
import "../../styles/ui/Timer.scss";

const Timer = (time) => {
  const [countdownTime, setCountdownTime] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(true);
  const countdownIntervalId = useRef(0);

  useEffect(() => {
    doStartCountdown();
    return () => {
      doStopCountdown();
    };
  }, []);

  useEffect(() => {
    if (countdownTime <= 0) {
      doStopCountdown();
    }
  }, [countdownTime]);

  const doStartCountdown = () => {
    countdownIntervalId.current = window.setInterval(() => {
      setCountdownTime((pastState) => {
        return pastState - 1;
      });
    }, 1000);
  };

  const doStopCountdown = () => {
    window.clearInterval(countdownIntervalId.current);
  };

  const doResetCountdown = () => {
    doStopCountdown();

    setCountdownTime(time);
    doStartCountdown();
  };

  return (
    <div className="countdown-timer-container">
      <p className="countdown-timer-time">{countdownTime}</p>
    </div>
  );
};
export default Timer;
