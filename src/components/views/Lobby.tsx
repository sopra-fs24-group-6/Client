import React, { useState, useEffect, useCallback } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import User from "models/User";
import Lobby from "models/Lobby";
import "styles/views/Lobby.scss";
import initialPlayers from "components/placeholders/playerlist";
import NavBar from "../ui/NavBar";
import NesContainer from "../ui/NESContainer";
import NESContainerW from "../ui/NESContainerW";
import NESRadioButton from "../ui/NESRadioButtons";
import PlayerLimiter from "../ui/PlayerLimiter";
import RoundLimiter from "../ui/RoundLimiter";
import Slider from "../ui/Slider";
import CustomButton from "../ui/CustomButton";
import ThemePopUp from "components/ui/ThemePopUp";
import { useLobbyWebSocket } from "helpers/LobbyWebSocketManager";

// import { Client } from "@stomp/stompjs";
// import { getBrokerURL } from "helpers/getBrokerURL"

const GameLobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [isPublished, setIsPublished] = useState(false);
  const [isAdmin, setIsAdmin] = useState(location.state?.isAdmin || false);
  const [lobby, setLobby] = useState("test");

  const { lobbyId: urlLobbyId } = useParams();

  const [lobbyId, setLobbyId] = useState(null);

  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerLimit, setPlayerLimit] = useState(3);
  const [playerCount, setPlayerCount] = useState(null);
  const [rounds, setRounds] = useState(3);
  const [roundTimer, setRoundTimer] = useState(60);
  const [clueTimer, setClueTimer] = useState(10);
  const [discussionTimer, setDiscussionTimer] = useState(60);
  const [availableThemes, setAvailableThemes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [showThemePopUp, setShowThemePopUp] = useState(false);
  const userId = localStorage.getItem("userId");

  const lobbyTypeChanger = (value) => {
    setIsPrivate(value === "private");
  };

  useEffect(() => {
    // This will run after selectedThemes has been updated.
    console.log("selectedThemes has been updated", selectedThemes);
  }, [selectedThemes]);

  //   useEffect(() => {
  //   const fetchThemes = async () => {
  //     try {
  //       const response = await api.get('/themes');
  //       const themes = response.data;
  //       setAvailableThemes(themes);
  //       //setSelectedThemes(themes);
  //       console.log("What is fetched",themes);
  //     } catch (error) {
  //       console.error(`Failed to fetch themes: ${handleError(error)}`);
  //     }
  //   };
  //   fetchThemes();
  // },[]);

  useEffect(() => {
    setIsAdmin(location.state?.isAdmin || false);
    // Set the lobbyId state with the value from useParams if available
    if (urlLobbyId) {
      setLobbyId(urlLobbyId);
    }
  }, [location.state?.isAdmin, urlLobbyId]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const themesResponse = await api.get("/themes");
        const themes = themesResponse.data;

        setAvailableThemes(themes);
        setSelectedThemes(themes);
      } catch (error) {
        console.error("Error fetching themes:", error);
      }
    };

    fetchThemes();
  }, []);

  const createLobby = async () => {
    try {
      // Fetch themes first
      // const themesResponse = await api.get('/themes');
      // const themes = themesResponse.data;
      // setAvailableThemes(themes);
      // setSelectedThemes(themes);
      // console.log(availableThemes);

      const requestBody = {
        lobbyAdmin: userId,
        name,
        password,
        playerLimit,
        themes: selectedThemes,
        themes: selectedThemes,
        rounds,
        roundTimer,
        clueTimer,
        discussionTimer,
        isPrivate,
      };

      const lobbyResponse = await api.post("/lobbies", requestBody);
      const newLobby = lobbyResponse.data;
      setLobby(newLobby);
      console.log("themes on creation", newLobby.themes);
      setLobbyId(newLobby.id);
      setIsPublished(true);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  };

  // const createLobby = async () => {
  //   const requestBody = {
  //     lobbyAdmin: userId,
  //     name,
  //     password,
  //     playerLimit,
  //     selectedThemes,
  //     rounds,
  //     roundTimer,
  //     clueTimer,
  //     discussionTimer,
  //     isPrivate,
  //   };

  //   try {
  //     const response = await api.post("/lobbies", requestBody);
  //     const newLobby = response.data;
  //     setLobby(newLobby);
  //     console.log("themes on creation", newLobby.themes);
  //     setLobbyId(newLobby.id);
  //     setIsPublished(true);
  //   } catch (error) {
  //     alert(`Something went wrong while creating the lobby: \n${handleError(error)}`);
  //   }
  // };

  // const fetchStandardLobby = async () => {
  //   try {
  //     const response = await api.get('/lobby/' + lobbyId); // Replace with your actual endpoint
  //     const lobby = response.data;
  //     setAvailableThemes(lobby.themes);
  //     setRounds(lobby.rounds);
  //     setRoundTimer(lobby.roundTimer);
  //     setClueTimer(lobby.clueTimer);
  //     setDiscussionTimer(lobby.discussionTimer);
  //     setPlayerLimit(lobby.playerLimit);
  //     // we need a vote timer?
  //   } catch (error) {
  //     console.error(`Failed to fetch standard lobby: ${handleError(error)}`);
  //   }
  // };

  //   // if (!isPublished) {
  //   //   fetchStandardLobby();
  //   // }

  //   // const handleChat = (chat) => {
  //   //   setChat(chat);
  //   // };
  //   //if(!isAdmin)

  const lobbyCallback = useCallback(
    (newLobby) => {
      setLobby(newLobby);
      // setLobbyId(newLobby.id);
      setName(newLobby.name);
      setPassword(newLobby.password);
      setPlayers(newLobby.players);
      setPlayerLimit(newLobby.playerLimit);
      setPlayerCount(newLobby.playerCount);
      //setAvailableThemes(availableThemes);
      setSelectedThemes(newLobby.themes);
      setRounds(newLobby.rounds);
      setRoundTimer(newLobby.roundTimer);
      setClueTimer(newLobby.clueTimer);
      setDiscussionTimer(newLobby.discussionTimer);
      setIsPrivate(newLobby.isPrivate);
      console.log("Themes on update", newLobby.themes);
    },
    [selectedThemes]
  );
  const lobbyCallback = useCallback(
    (newLobby) => {
      setLobby(newLobby);
      // setLobbyId(newLobby.id);
      setName(newLobby.name);
      setPassword(newLobby.password);
      setPlayers(newLobby.players);
      setPlayerLimit(newLobby.playerLimit);
      setPlayerCount(newLobby.playerCount);
      //setAvailableThemes(availableThemes);
      setSelectedThemes(newLobby.themes);
      setRounds(newLobby.rounds);
      setRoundTimer(newLobby.roundTimer);
      setClueTimer(newLobby.clueTimer);
      setDiscussionTimer(newLobby.discussionTimer);
      setIsPrivate(newLobby.isPrivate);
      console.log("Themes on update", newLobby.themes);
    },
    [selectedThemes]
  );

  const playerCallback = useCallback((newPlayers) => {
    setPlayers(newPlayers);
  }, []);

  const startGameCallback = useCallback(() => {
    //const gameId = localStorage.getItem("lobbyId");
    setLobbyId(lobbyId);
    localStorage.setItem("lobbyId", lobbyId);
    //console.log("check", lobbyId)
    navigate("/game/" + lobbyId);
  }, [lobbyId]);

  //   setSendMessage(
  //     subscribeToLobbyWebSocket(handleLobbyUpdate, handlePlayer)
  //     //subscribeToLobbyWebSocket(handleChat,handleLobbyUpdate, handleGameStart, handlePlayer)
  //   );
  const { sendMessage, connected, client } = useLobbyWebSocket(
    lobbyId,
    startGameCallback,
    lobbyCallback,
    playerCallback,
    userId
    userId
  );

  // useEffect(() => {
  //   if (isPublished && isAdmin) {
  //     updateLobby();
  //   }
  // }, [
  //   name,
  //   password,
  //   players,
  //   playerLimit,
  //   playerCount,
  //   selectedThemes,
  //   rounds,
  //   roundTimer,
  //   clueTimer,
  //   discussionTimer,
  //   isPrivate,
  // ]);

  const updateLobby = async () => {
    if (!lobbyId) return;
    const requestBody = {
      name,
      password,
      players,
      playerLimit,
      playerCount,
      rounds,
      roundTimer,
      clueTimer,
      discussionTimer,
      isPrivate,
      themes: selectedThemes,
      themes: selectedThemes,
    };
    console.log("Update method log", selectedThemes);

    try {
      await api.put(`/lobbies/${lobbyId}`, requestBody);
    } catch (error) {
      alert(
        `Something went wrong while updating the lobby: \n${handleError(error)}`
      );
      alert(
        `Something went wrong while updating the lobby: \n${handleError(error)}`
      );
    }
  };

  const handlePlayerLimitChange = (value) => {
    setPlayerLimit(value);
  };

  const handleRoundLimitChange = (value) => {
    setRounds(value);
  };

  const kickPlayer = async (player) => {
    try {
      const requesterId = localStorage.getItem("userId");
      if (!requesterId) {
        alert("No requesterId found in local storage.");

        return;
      }
      const requestBody = {
        userId: requesterId,
      };
      await api.delete("/lobbies/" + lobbyId + "/players/" + player.id, {
        data: requestBody,
      });
    } catch (error) {
      alert(`Could not kick player: \n${handleError(error)}`);
    }
  };

  const leaveGame = async (lobbyId, userId) => {
    try {
      await api.delete("/lobbies/" + lobbyId + "/players/" + userId);
    } catch (error) {
      alert(`Could not leave game: \n${handleError(error)}`);
    }
  };

  //Listenser to remove Player from Lobby when unexpectetly leaving the lobby view
  /*  window.addEventListener("beforeunload", function (event) {
    const confirmationMessage = "Are you sure you want to leave the lobby?";
    event.returnValue = confirmationMessage;

    leaveGame(lobbyId, userId);
  }); */

  window.addEventListener("beforeunload", function (event) {
    // Display confirmation message
    const confirmationMessage = "Are you sure you want to leave the lobby?";
    event.returnValue = confirmationMessage;

    // Call leaveGame function with appropriate userId and lobbyId
    // Make sure to replace 'userId' and 'lobbyId' with actual values
    leaveGame(lobbyId, userId);
  });
  const startGame = () => {
    if (client && connected) {
      client.publish({
        destination: "/app/startGame",
        body: JSON.stringify({ lobbyId, userId }),
      });
    } else {
      console.log("Lobby ID is null, cannot start game.");
    }
  };

  const handleSelectThemes = (selected) => {
    setSelectedThemes(selected);
    setShowThemePopUp(false);
  };

  const handleThemePopUpClose = () => {
    setShowThemePopUp(false);
  };

  return (
    <>
      <NavBar />
      <div className="Center">
        <NesContainer title="">
          <h1 className="press-start-font">Lobby Settings</h1>
        </NesContainer>
        <div className="Extension Flex">
          <NESContainerW title="Choose Settings" className="left">
            <div className="wrapper">
              <div className="setting-container">
                <label>Lobby Name:</label>
                <input
                  className="setting-field"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
              <div className="Space Flex">
                <label> Lobby Type:</label>
                <NESRadioButton
                  name="Lobby Type"
                  options={[
                    { label: "Public", value: "public" },
                    { label: "Private", value: "private" },
                  ]}
                  defaultValue={isPrivate ? "private" : "public"}
                  onChange={lobbyTypeChanger}
                  disabled={!isAdmin}
                />
              </div>
              {isPrivate && (
                <div className="setting-container">
                  <div className="Space Flex">
                    <label>Password:</label>
                    <input
                      className="setting-field"
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!isAdmin}
                    />
                  </div>
                </div>
              )}
              <div className="Space Flex">
                <label>Player Limit:</label>
                <PlayerLimiter
                  value={playerLimit}
                  disabled={!isAdmin}
                  onPlayerLimitChange={handlePlayerLimitChange}
                />
              </div>
              <div className="Space Flex">
                <label htmlFor="roundLimit">Round Limit:</label>{" "}
                {/* Accessible label association */}
                <label htmlFor="roundLimit">Round Limit:</label>{" "}
                {/* Accessible label association */}
                <RoundLimiter
                  value={rounds}
                  onRoundLimitChange={handleRoundLimitChange}
                  disabled={!isAdmin}
                />
              </div>
              <div className="Space Flex">
                <label>Round Timer:</label>
                <Slider
                  //min={60}
                  min={5} // for developing phase
                  max={120}
                  step={10}
                  value={roundTimer}
                  onChange={(e) => setRoundTimer(parseInt(e.target.value))}
                  disabled={!isAdmin}
                />
              </div>
              <div className="Space Flex">
                <label>Clue Timer:</label>
                <Slider
                  // min={10}
                  min={3} // for developing phase
                  max={120}
                  step={10}
                  value={clueTimer}
                  onChange={(e) => setClueTimer(parseInt(e.target.value))}
                  disabled={!isAdmin}
                />
              </div>
              <div className="Space Flex">
                <label>Discussion Timer:</label>
                <Slider
                  // min={60}
                  min={5} // for developing phase
                  max={120}
                  step={10}
                  value={discussionTimer}
                  onChange={(e) => setDiscussionTimer(parseInt(e.target.value))}
                  disabled={!isAdmin}
                />
              </div>
              <div className="Space Flex">
                <label>Themes:</label>
                <button
                  onClick={() => setShowThemePopUp(true)}
                  disabled={!isAdmin || availableThemes.length === 0}
                >
                  Select Themes
                </button>
                {showThemePopUp && (
                  <ThemePopUp
                    themes={availableThemes}
                    selectedThemes={selectedThemes}
                    onSelect={handleSelectThemes}
                    onClose={handleThemePopUpClose}
                  />
                )}
                <ul>
                  {selectedThemes.map((theme) => (
                    <li key={theme}>{theme}</li>
                  ))}
                </ul>
              </div>
              {!isPublished && isAdmin && (
                <div className="Space">
                  <CustomButton
                    text="Create Lobby"
                    className="50 hover-orange"
                    onClick={() => createLobby()}
                  />
                </div>
              )}
              {isPublished && isAdmin && (
                <div className="Space">
                  <CustomButton
                    text="Start Game"
                    className="50 hover-green"
                    onClick={() => startGame()}
                  />
                </div>
              )}
            </div>
          </NESContainerW>
          <NESContainerW title="Players Joined" className="right">
            <h2>
              Players {players.length} / {playerLimit}
            </h2>
            <ul className="list-style">
              {players.map((player, index) => {
                if (!player.userId) {
                }

                return (
                  <li className="Aligner" key={player.userId || index}>
                    {player.username}
                    {isAdmin && (
                      <CustomButton
                        text="Kick"
                        className="small-kick margin-kick hover-red"
                        onClick={() => kickPlayer(player.userId)}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </NESContainerW>
        </div>
      </div>

      <div className="Space">
        <CustomButton
          text="Update Lobby"
          className="50 hover-green"
          onClick={updateLobby}
          disabled={!isPublished || !isAdmin}
        />
      </div>
    </>
  );
};

export default GameLobby;

