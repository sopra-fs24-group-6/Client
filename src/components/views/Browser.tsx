import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "styles/views/Browser.scss";
import "styles/ui/popUp.scss";
import CustomButton from "components/ui/CustomButton";
import BaseContainer from "components/ui/BaseContainer";
import lobbyList from "components/placeholders/lobbylist";
import NavBar from "../ui/NavBar";
import NesContainer from "../ui/NESContainer";
import "styles/views/Lobby.scss";
import NESContainerW from "../ui/NESContainerW";

const Browser = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState(lobbyList);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState(null);
  const [selectedLobby, setSelectedLobby] = useState(null);
  const userId = localStorage.getItem("userId");


  useEffect(() => {
    const getLobbies = async () => {
      try {
        const response = await api.get("/lobbies");
        setLobbies(response.data);
      } catch (error) {
        alert(`Something went wrong when trying to fetch available lobbies: \n${handleError(error)}`);
      }
    };
    // get all available lobbies when mount
    getLobbies();

    // polling with interval
    const intervalId = setInterval(getLobbies, 3000);

    return () => clearInterval(intervalId);
  }, []);


  const joinLobby = async (selectedLobby) => {
    setSelectedLobby(selectedLobby);
    if (!selectedLobby.isPrivate) {
      try {
        await api.post("/lobbies/" + selectedLobby.id + "/players", { userId });
        navigate(`/lobby/${selectedLobby.id}`, { state: { isAdmin: false } })
      } catch (error) {
        alert(
          `Something went wrong during joining lobby: \n${handleError(
            error
          )}`
        );
      }
    } else {
      setPasswordPrompt(true);
    }
  };

  const passwordSubmit = async () => {
    try {
      await api.post("/lobbies/" + selectedLobby.id + "/authentication", { password });
      await api.post("/lobbies/" + selectedLobby.id + "/players", { userId });
      navigate(`/lobby/${selectedLobby.id}`, { state: { isAdmin: false } });
    } catch (error) {
      alert(
        `Something went wrong during the authentication: \n${handleError(
          error
        )}`
      );
    }
  };

  return (
    <>
      <NavBar />
      <div className="Center">
        <NesContainer title="">
          <h1 className="press-start-font">Lobby Browser</h1>
        </NesContainer>
        <div className="Space">
          <NESContainerW title="Join a lobby" className="center">
            <table style={{ margin: "0 auto", textAlign: "center" }}>
              <thead>
                <tr>
                  <th className="table-header"> Lobby Name</th>
                  <th className="table-header">Lobby Type</th>
                  <th className="table-header">Players</th>
                  <th className="table-header">Player Limit</th>
                  <th className="table-header">Themes</th>
                  <th className="table-header">Status</th>
                  <th className="table-header"></th>
                </tr>
              </thead>
              <tbody>
                {lobbies.map((lobby) => (
                  <tr key={lobby.id}>
                    <td className="browser-items">
                      {lobby.name}
                    </td>
                    <td className="browser-items">
                      {lobby.isPrivate ? "Private" : "Public"}
                    </td>
                    <td className="browser-items">
                      {lobby.players.length}
                    </td>
                    <td className="browser-items">
                      {lobby.playerLimit}
                    </td>
                    <td className="browser-items">
                      {lobby.themes.join(", ")}
                    </td>
                    <td className="browser-items">
                      {lobby.status}
                    </td>
                    <td className="browser-items">
                      <CustomButton
                        text="Join"
                        className="small hover-green"
                        onClick={() => joinLobby(lobby)}
                        disabled={lobby.status !== "OPEN"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {passwordPrompt && (
              <div className="popup-container">
                <div className="popup">
                  <input
                    type="password"
                    placeholder="Enter lobby password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <CustomButton
                    text="Submit"
                    className="small hover-green"
                    onClick={passwordSubmit}
                  />
                  <CustomButton
                    text="Cancel"
                    className="small hover-red"
                    onClick={() => setPasswordPrompt(false)}
                  />
                </div>
              </div>
            )}
          </NESContainerW>
        </div>
      </div>
    </>
  );
};

export default Browser;
