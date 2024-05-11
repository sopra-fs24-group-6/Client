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
  const [lobbyAdmin, setLobbyAdmin] = useState("");
  const [password, setPassword] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerLimit, setPlayerLimit] = useState(3);
  const [playerCount, setPlayerCount] = useState(null);
  const [rounds, setRounds] = useState(1);
  const [roundTimer, setRoundTimer] = useState(60);
  const [clueTimer, setClueTimer] = useState(10);
  const [discussionTimer, setDiscussionTimer] = useState(60);
  const [availableThemes, setAvailableThemes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);

  const [isKicked, setIsKicked] = useState(false);
  const [isLobbyDeleted, setIsLobbyDeleted] = useState(false);
  const [showThemePopUp, setShowThemePopUp] = useState(false);
  const [showCreated, setShowCreated] = useState(false);
  const [showStartGamePopUp, setShowStartGamePopUp] = useState(false);
  const [showDeleteLobbyPopUp, setShowDeleteLobbyPopUp] = useState(false);
  const [showLeaveLobbyPopUp, setShowLeaveLobbyPopUp] = useState(false);
  const [showJoinLobbyPopUp, setShowJoinLobbyPopUp] = useState(false);
  const [showUpdateLobbyPopUp, setShowUpdateLobbyPopUp] = useState(false);
  const userId = localStorage.getItem("userId");

  const lobbyTypeChanger = (value) => {
    setIsPrivate(value === "private");
  };

  useEffect(() => {
    setIsAdmin(location.state?.isAdmin || false);
    setShowJoinLobbyPopUp(true);
    // Set the lobbyId state with the value from useParams if available
    if (urlLobbyId) {
      setLobbyId(urlLobbyId);
    }
  }, [location.state?.isAdmin, urlLobbyId]);

  // if not admin, then fetch lobby data when load page
  useEffect(() => {
    if (!isAdmin) {
      const fetchLobbyData = async () => {
        try {
          const response = await api.get(`/lobbies/${urlLobbyId}`);
          const lobbyData = response.data;
          setLobby(lobbyData);
          setPlayers(lobbyData.players);
          setName(lobbyData.name);
          setLobbyAdmin(lobbyData.lobbyAdmin);
          setPlayerLimit(lobbyData.playerLimit);
          setPlayerCount(lobbyData.playerCount);
          setRounds(lobbyData.rounds);
          setRoundTimer(lobbyData.roundTimer);
          setClueTimer(lobbyData.clueTimer);
          setDiscussionTimer(lobbyData.discussionTimer);
          setIsPrivate(lobbyData.isPrivate);
          setSelectedThemes(lobbyData.themes);
        } catch (error) {
          console.error(`Failed to fetch lobby: ${handleError(error)}`);
        }
      };
      fetchLobbyData();
    }
  }, [isAdmin, urlLobbyId]);

  useEffect(() => {
    if (isAdmin) {
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
    }
  }, []);

  const createLobby = async () => {
    try {
      const requestBody = {
        lobbyAdmin: userId,
        name,
        password,
        playerLimit,
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
      setPlayers(newLobby.players);
      setLobbyAdmin(newLobby.lobbyAdmin);
      setLobbyId(newLobby.id);
      setIsPublished(true);
      setShowCreated(true);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  };

  const lobbyCallback = useCallback(
    (newLobby) => {
      setLobby(newLobby);
      setName(newLobby.name);
      setLobbyAdmin(newLobby.lobbyAdmin);
      setPassword(newLobby.password);
      setPlayers(newLobby.players);
      setPlayerLimit(newLobby.playerLimit);
      setPlayerCount(newLobby.playerCount);
      setSelectedThemes(newLobby.themes);
      setRounds(newLobby.rounds);
      setRoundTimer(newLobby.roundTimer);
      setClueTimer(newLobby.clueTimer);
      setDiscussionTimer(newLobby.discussionTimer);
      setIsPrivate(newLobby.isPrivate);
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

  const lobbyEventCallback = useCallback((event) => {
    if (event.eventType === "kickedByHost") {
      setIsKicked(true);
    } else if (event.eventType === "lobbyDeleted") {
      setIsLobbyDeleted(true);
    }
  }, []);

  //   setSendMessage(
  //     subscribeToLobbyWebSocket(handleLobbyUpdate, handlePlayer)
  //     //subscribeToLobbyWebSocket(handleChat,handleLobbyUpdate, handleGameStart, handlePlayer)
  //   );
  const { sendMessage, connected, client } = useLobbyWebSocket(
    isAdmin,
    lobbyId,
    startGameCallback,
    lobbyCallback,
    playerCallback,
    userId,
    lobbyEventCallback
  );

  // when kicked or lobby deleted, then back to menu with interval
  useEffect(() => {
    if (isKicked || isLobbyDeleted) {
      setTimeout(() => {
        navigate("/menu");
      }, 3000);
    }
  }, [isKicked, isLobbyDeleted]);

  const updateLobby = async () => {
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
      themes: selectedThemes,
    };
    if (isAdmin) {
      try {
        await api.put(`/lobbies/${lobbyId}`, requestBody);
        setShowUpdateLobbyPopUp(true);
      } catch (error) {
        alert(
          `Something went wrong while updating the lobby: \n${handleError(
            error
          )}`
        );
      }
    }
  };

  const handlePlayerLimitChange = (value) => {
    setPlayerLimit(value);
  };

  const handleRoundLimitChange = (value) => {
    setRounds(value);
  };

  const kickPlayer = async (targetUserId) => {
    try {
      const requesterId = localStorage.getItem("userId");
      if (!requesterId) {
        alert("No requesterId found in local storage.");

        return;
      }
      const requestBody = {
        userId: requesterId,
      };
      await api.delete("/lobbies/" + lobbyId + "/players/" + targetUserId, {
        data: requestBody,
      });
    } catch (error) {
      alert(`Could not kick player: \n${handleError(error)}`);
    }
  };

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
                  disabled={!isAdmin || isPublished}
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
                  min={5} // for developing phase
                  max={20}
                  step={5}
                  value={clueTimer}
                  onChange={(e) => setClueTimer(parseInt(e.target.value))}
                  disabled={!isAdmin}
                />
              </div>
              <div className="Space Flex">
                <label>Discussion Timer:</label>
                <Slider
                  min={5}
                  // min={60}
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
                    className="50 hover-orange margin-top"
                    onClick={() => createLobby()}
                  />
                </div>
              )}
              {isPublished && isAdmin && (
                <div className="Space">
                  <CustomButton
                    text="Start Game"
                    className="50 hover-green margin-right margin-top"
                    onClick={() => setShowStartGamePopUp(true)}
                  />
                  <CustomButton
                    text="Update Lobby"
                    className="50 hover-orange margin-right margin-top"
                    onClick={() => updateLobby()}
                  />
                  <CustomButton
                    text="Delete Lobby"
                    className="50 hover-red margin-top"
                    onClick={() => setShowDeleteLobbyPopUp(true)}
                  />
                </div>
              )}
              {!isAdmin && (
                <div className="Space">
                  <CustomButton
                    text="Leave Lobby"
                    className="50 hover-red margin-top"
                    onClick={() => setShowLeaveLobbyPopUp(true)}
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
                return (
                  <li className="Aligner" key={player.userId || index}>
                    {player.username}
                    {String(player.userId) === String(lobbyAdmin) ? (
                      <span>&nbsp;(Host)</span>
                    ) : (
                      isAdmin && (
                        <CustomButton
                          text="Kick"
                          className="small-kick margin-kick hover-red"
                          onClick={() => kickPlayer(player.userId)}
                        />
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          </NESContainerW>
        </div>

        {/* Pop-ups */}
        {isKicked && (
          <div className="popup-container">
            <div className="popup">
              <p>Oops, you have been kicked out by the host...</p>
              <p>You will be redirected to the menu screen.</p>
            </div>
          </div>
        )}
        {isLobbyDeleted && !isAdmin && (
          <div className="popup-container">
            <div className="popup">
              <p>Oops, lobby has been deleted by the host...</p>
              <p>You will be redirected to the menu screen.</p>
            </div>
          </div>
        )}
        {showCreated && (
          <div className="popup-container">
            <div className="popup">
              <p>Lobby has been successfully created!</p>
              <CustomButton
                text="OK"
                className="small hover-green"
                onClick={() => setShowCreated(false)}
              />
            </div>
          </div>
        )}
        {showUpdateLobbyPopUp && (
          <div className="popup-container">
            <div className="popup">
              <p>Lobby has been successfully updated!</p>
              <CustomButton
                text="OK"
                className="small hover-green"
                onClick={() => setShowUpdateLobbyPopUp(false)}
              />
            </div>
          </div>
        )}
        {showJoinLobbyPopUp && !isAdmin && (
          <div className="popup-container">
            <div className="popup">
              <p>Joined lobby successfully!</p>
              <p>Please wait until host starts game.</p>
              <CustomButton
                text="OK"
                className="small hover-green"
                onClick={() => setShowJoinLobbyPopUp(false)}
              />
            </div>
          </div>
        )}
        {showStartGamePopUp && (
          <div className="popup-container">
            <div className="popup">
              <p>Are you ready to start game?</p>
              <CustomButton
                text="OK"
                className="small hover-green margin-right"
                onClick={() => {
                  setShowStartGamePopUp(false);
                  startGame();
                }}
              />
              <CustomButton
                text="Cancel"
                className="small hover-red"
                onClick={() => setShowStartGamePopUp(false)}
              />
            </div>
          </div>
        )}
        {showDeleteLobbyPopUp && (
          <div className="popup-container">
            <div className="popup">
              <p>Do you really want to delete lobby?</p>
              <CustomButton
                text="OK"
                className="small hover-green margin-right"
                onClick={() => {
                  setShowDeleteLobbyPopUp(false);
                  navigate("/menu");
                }}
              />
              <CustomButton
                text="Cancel"
                className="small hover-red"
                onClick={() => setShowDeleteLobbyPopUp(false)}
              />
            </div>
          </div>
        )}
        {showLeaveLobbyPopUp && (
          <div className="popup-container">
            <div className="popup">
              <p>Do you really want to leave lobby?</p>
              <CustomButton
                text="OK"
                className="small hover-green margin-right"
                onClick={() => {
                  setShowLeaveLobbyPopUp(false);
                  navigate("/menu");
                }}
              />
              <CustomButton
                text="Cancel"
                className="small hover-red"
                onClick={() => setShowLeaveLobbyPopUp(false)}
              />
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default GameLobby;
