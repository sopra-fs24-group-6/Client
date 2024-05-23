import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { handleError } from "helpers/api";
import "../../styles/ui/Overlay.scss";

const ClueOverlay = ({ isWolf, words, round, onClose }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setShowOverlay(true);

    const timeout1 = setTimeout(() => {
      setStage(1);
    }, 2000);
    const timeout2 = setTimeout(() => {
      setShowOverlay(false);
      onClose();
    }, 4000);

    return () => {
      clearInterval(timeout1);
      clearInterval(timeout2);
    };
  }, [isWolf, words, round, onClose]);

  return showOverlay ? (
    <div className="overlay">
      <div className="content">
        {stage === 0 && <h2>Round {round}</h2>}
        {stage === 1 && (
          <h2>This round&apos;s word is: {isWolf ? words[1] : words[0]}</h2>
        )}
      </div>
    </div>
  ) : null;
};

ClueOverlay.propTypes = {
  isWolf: PropTypes.bool.isRequired,
  words: PropTypes.array.isRequired,
  round: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ClueOverlay;