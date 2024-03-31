import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import Lobby from "models/Lobby";
import "styles/views/Lobby.scss";
import initialPlayers from "components/placeholders/playerlist";
import NavBar from "../ui/NavBar";
import NesContainer from "../ui/NESContainer";
import NESContainerW from "../ui/NESContainerW";
import NESRadioButton from "../ui/NESRadioButtons";


const GameLobby = () => {
  const navigate = useNavigate();
  let isPublished = false;
  let isAdmin = true;
  const [lobby, setLobby] = useState(null);

  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [players, setPlayers] = useState(initialPlayers);
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
      const lobbyAdmin = localStorage.getItem("id");
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
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong when trying to start the game: \n${handleError(
          error
        )}`
      );
    }
  };

  return (
    //   <div className="container">
    //     <div className="settings">
    //       <h2>Lobby Settings</h2>
    //       <div>
    //         <label>Lobby Name:</label>
    //         <input
    //           type="text"
    //           value={name}
    //           onChange={(e) => setName(e.target.value)}
    //           disabled={!isAdmin}
    //         />
    //       </div>
    //       <div>
    //         <div>
    //           Lobby Type:
    //           <label>
    //             Public
    //             <input
    //               type="radio"
    //               name="isPrivate"
    //               checked={!isPrivate}
    //               onChange={() => setIsPrivate(false)}
    //               disabled={!isAdmin}
    //             />
    //           </label>
    //           <label>
    //             Private
    //             <input
    //               type="radio"
    //               name="isPrivate"
    //               checked={isPrivate}
    //               onChange={() => setIsPrivate(true)}
    //               disabled={!isAdmin}
    //             />
    //           </label>
    //         </div>
    //       </div>
    //       {isPrivate && (
    //         <div>
    //           <label>Lobby Password:</label>
    //           <input
    //             type="text"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             disabled={!isAdmin}
    //           />
    //         </div>
    //       )}
    //       <div>
    //         <label>Player Limit:</label>
    //         <select
    //           value={playerLimit}
    //           onChange={(e) => setPlayerLimit(parseInt(e.target.value))}
    //           disabled={!isAdmin}
    //         >
    //           {[3, 4, 5, 6].map((count) => (
    //             <option key={count} value={count}>
    //               {count}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //       <div>
    //         <label>Round Timer:</label>
    //         <input
    //           type="range"
    //           min={30}
    //           max={300}
    //           step={10}
    //           value={roundTimer}
    //           onChange={(e) => setRoundTimer(parseInt(e.target.value))}
    //           disabled={!isAdmin}
    //         />
    //         <span>{roundTimer} seconds</span>
    //       </div>
    //       <div>
    //         <label>Clue Timer:</label>
    //         <input
    //           type="range"
    //           min={5}
    //           max={30}
    //           step={5}
    //           value={clueTimer}
    //           onChange={(e) => setClueTimer(parseInt(e.target.value))}
    //           disabled={!isAdmin}
    //         />
    //         <span>{clueTimer} seconds</span>
    //       </div>
    //       <div>
    //         <label>Discussion Timer:</label>
    //         <input
    //           type="range"
    //           min={30}
    //           max={300}
    //           step={10}
    //           value={discussionTimer}
    //           onChange={(e) => setDiscussionTimer(parseInt(e.target.value))}
    //           disabled={!isAdmin}
    //         />
    //         <span>{discussionTimer} seconds</span>
    //       </div>
    //       <div>
    //         {!isPublished && <button onClick={createLobby}>Create Lobby</button>}
    //         {isPublished && isAdmin && (
    //           <button onClick={startGame}>Start Game</button>
    //         )}
    //       </div>
    //     </div>
    //     <div className="players">
    //       <h2>
    //         Players {players.length} / {playerLimit}
    //       </h2>
    //       <ul>
    //         {players.map((player, index) => (
    //           <li key={index}>{player}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   </div>
    <>
      <NavBar />
      <div className="Center" >
        <NesContainer title="">
          <h1 className="press-start-font">Lobby Settings</h1>
        </NesContainer>
        <div className="Extension Flex">
          <NESContainerW title="Choose Settings" className="left">
            <div className="setting-container">
              <label className="setting-label">Lobby Name:</label>
              <input className="setting-field" type="text"/>
            </div>
            <div className="Space Flex">
              <label> Lobby Type:</label>
              <NESRadioButton
                name="Lobby Type"
                options={[
                  { label: "Public", value: "yes" },
                  { label: "Private", value: "no" }
                ]}
                defaultValue="yes"
              />
            </div>
          </NESContainerW>
          <NESContainerW title="Players Joined" className="right">

          </NESContainerW>
        </div>
      </div>

    </>
  );
};

export default GameLobby;