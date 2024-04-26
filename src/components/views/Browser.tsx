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

  //*** For Testing Purposes***
  useEffect(() => {
    // Immediately-invoked function expression (IIFE) with an async function
    (async () => {
      try {
        const response = await api.get("/lobbies");
        setLobbies(response.data);
        console.log(response.data)
      } catch (error) {
        alert(`Something went wrong when trying to fetch available lobbies: \n${handleError(error)}`);
      }
    })();
  }, []); 

  const getLobbies = async () => {
    try {
      const response = await api.get("/lobbies");
      setLobbies(response.data);
    } catch (error) {
      alert(
        `Something went wrong when trying to fetch available lobbies: \n${handleError(
          error
        )}`
      );
    }
  };
  const joinLobby = async (selectedLobby) => {
    setSelectedLobby(selectedLobby);
    // const userId = localStorage.getItem("id");
    // const userId = "2"; // ***This is for test***
    const userId = localStorage.getItem('userId') // ***For Testing purposes***
    if (!selectedLobby.password) {
      await api.post("/lobbies/" + selectedLobby.id + "/players", { userId });
      // navigate("/lobbies/" + selectedLobby.id);
      //For testing purposes
      navigate(`/lobby/${selectedLobby.id}`, { state: { isAdmin: false } })
    } else {
      setPasswordPrompt(true);
    }
  };

  const passwordSubmit = async () => {
    try {
      await api.post("/lobbies/" + selectedLobby.id + "/authentication", { password });
      // const userId = localStorage.getItem("id");
      const userId = "3"; // ***This is for test***
      await api.post("/lobbies/" + selectedLobby.id + "/players", { userId });
      navigate(`/lobby/${selectedLobby.id}`, { state: { isAdmin: false } });
    } catch (error) {
      alert(
        `Something went wrong during the authentifiation: \n${handleError(
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
                      {lobby.password ? "Private" : "Public"}
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
                      <CustomButton
                        text="Join"
                        className="small hover-green"
                        onClick={() => joinLobby(lobby)}
                      ></CustomButton>
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
                  ></CustomButton>
                  <CustomButton
                    text="Cancel"
                    className="small hover-red"
                    onClick={() => setPasswordPrompt(false)}
                  ></CustomButton>
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
