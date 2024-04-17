import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "types";
import { api, handleError } from "helpers/api";
import ClueOverlay from "../ui/ClueOverlay";
import Timer from "../ui/Timer";

const Game = () => {
  const [words, setWords] = useState([]);
  const [wolf, setWolf] = useState<User>(null);
  const [settings, setSettings] = useState(null);
  const [round, setRound] = useState(1);
  const [order, setOrder] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isCurrentPlayerTurn, setIsCurrentPlayerTurn] = useState(false);
  const [isRoundTimerRunning, setIsRoundTimerRunning] = useState(false);
  const [isClueTimerRunning, setIsClueTimerRunning] = useState(false);
  const [clues, setClues] = useState([]);
  const player = localStorage.getItem("userId");

  const isWolf = (player) => {
    return wolf.id === player;
  };

  useEffect(() => {
    axios
      .get("game/settings")
      .then((response) => {
        setSettings(response.data);
      })
      .catch((error) => {
        alert(
          `Something went wrong while fetching the settings: \n${handleError(
            error
          )}`
        );
      });
  }, []);

  useEffect(() => {
    axios
      .get("game/wordpair")
      .then((response) => {
        setWords(response.data);
      })
      .catch((error) => {
        alert(
          `Something went wrong while fetching the clues: \n${handleError(
            error
          )}`
        );
      });

    axios
      .get("game/wolf")
      .then((response) => {
        setWolf(response.data);
      })
      .catch((error) => {
        alert(
          `Something went wrong while assigning the roles: \n${handleError(
            error
          )}`
        );
      });
  }, [round]);

  const handleClueTimerExpired = () => {
    const nextPlayerIndex = (currentPlayerIndex + 1) % order.length;
    setCurrentPlayerIndex(nextPlayerIndex);
    setIsClueTimerRunning(false);
    setIsCurrentPlayerTurn(order[nextPlayerIndex] === player);
  };

  const handleClueSubmit = (clue) => {
    setClues([...clues, clue]);
    const nextPlayerIndex = (currentPlayerIndex + 1) % order.length;
    setCurrentPlayerIndex(nextPlayerIndex);
    setIsCurrentPlayerTurn(order[nextPlayerIndex] === player);
  };

  return (
    <div>
      <ClueOverlay
        isWolf={isWolf(player)}
        words={words}
        round={round}
        onClose={() => setIsRoundTimerRunning(true)}
      />
      <div>
        This round&apos;s word is:
        {isWolf(player) ? words[1] : words[0]}
      </div>
      <div>
        {isRoundTimerRunning && (
          <Timer
            time={settings.roundTimer}
            onTimerExpired={setIsRoundTimerRunning(false)}
          />
        )}
      </div>
      <div>
        {isClueTimerRunning && isCurrentPlayerTurn && (
          <Timer
            time={settings.clueTimer}
            onTimerExpired={handleClueTimerExpired}
          />
        )}
      </div>
      {isCurrentPlayerTurn && (
        <div>
          <input
            type="text"
            placeholder="Enter your clue"
            onChange={(e) => handleClueSubmit(e.target.value)}
          />
        </div>
      )}
      <div>
        {clues.map((clue, index) => (
          <div key={index}>{clue}</div>
        ))}
      </div>
    </div>
  );
};
export default Game;
