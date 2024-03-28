import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import Lobby from "models/Lobby";

const GameLobby = () => {
  const navigate = useNavigate();
  const lobbyAdmin = localStorage.getItem("id");
  let isPublished = false;
  const [lobby, setLobby] = useState(null);

  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [players, setPlayers] = useState<Array<User>>(null);
  const [playerLimit, setPlayerLimit] = useState(4);
  const [playerCount, setPlayerCount] = useState(null);
  const [themes, setThemes] = useState<Array<any>>(null);
  const [roundTimer, setRoundTimer] = useState(60);
  const [clueTimer, setClueTimer] = useState(10);
  const [discussionTimer, setDiscussionTimer] = useState(60);

  useEffect(() => {
    if (isPublished) {
      updateLobby();
    }
  }, [
    name,
    password,
    players,
    playerLimit,
    playerCount,
    themes,
    roundTimer,
    clueTimer,
    discussionTimer,
  ]);

  const createLobby = async () => {
    try {
      const requestBody = JSON.stringify({
        lobbyAdmin,
        name,
        password,
        playerLimit,
        themes,
        roundTimer,
        clueTimer,
        discussionTimer,
      });
      const response = await api.post("/lobbies", requestBody);
      const lobby = new Lobby(response.data);
      setLobby(lobby);
      isPublished = true;
    } catch (error) {
      alert(
        `Something went wrong while creating the lobby: \n${handleError(error)}`
      );
    }
  };

  const updateLobby = async () => {
    try {
      const requestBody = JSON.stringify({
        name,
        password,
        players,
        playerLimit,
        playerCount,
        themes,
        roundTimer,
        clueTimer,
        discussionTimer,
      });
      const response = await api.put("/lobbies/" + lobby.id, requestBody);
      const updatedLobby = new Lobby(response.data);
      setLobby(updatedLobby);
    } catch (error) {
      alert(
        `Something went wrong while updating the lobby: \n${handleError(error)}`
      );
    }
  };

  const startGame = async () => {
    try {
      await api.post("/games", lobby);
    } catch (error) {
      alert(
        `Something went wrong when trying to start the game: \n${handleError(
          error
        )}`
      );
    }
  };
  return (
    <div>
      <h2>Lobby Settings</h2>
      <div>
        <label>Lobby Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Lobby Type:</label>
        <div>
          <label>
            Public
            <input
              type="radio"
              name="isPrivate"
              checked={!isPrivate}
              onChange={() => setIsPrivate(false)}
            />
          </label>
          <label>
            Private
            <input
              type="radio"
              name="isPrivate"
              checked={isPrivate}
              onChange={() => setIsPrivate(true)}
            />
          </label>
        </div>
      </div>
      {isPrivate && (
        <div>
          <label>Lobby Password:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}
      <div>
        <label>Player Count:</label>
        <select
          value={playerCount}
          onChange={(e) => setPlayerCount(parseInt(e.target.value))}
        >
          {[3, 4, 5, 6].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Round Timer:</label>
        <input
          type="range"
          min={30}
          max={300}
          step={10}
          value={roundTimer}
          onChange={(e) => setRoundTimer(parseInt(e.target.value))}
        />
        <span>{roundTimer} seconds</span>
      </div>
      <div>
        <label>Clue Timer:</label>
        <input
          type="range"
          min={5}
          max={30}
          step={5}
          value={clueTimer}
          onChange={(e) => setClueTimer(parseInt(e.target.value))}
        />
        <span>{clueTimer} seconds</span>
      </div>
      <div>
        <label>Discussion Timer:</label>
        <input
          type="range"
          min={30}
          max={300}
          step={10}
          value={discussionTimer}
          onChange={(e) => setDiscussionTimer(parseInt(e.target.value))}
        />
        <span>{discussionTimer} seconds</span>
      </div>
      <div>
        <button onClick={createLobby}>Create Lobby</button>
        <button onClick={startGame}>Start Game</button>
      </div>
    </div>
  );
};
export default GameLobby;
