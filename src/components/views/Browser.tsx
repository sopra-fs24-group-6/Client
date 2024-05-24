import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "styles/views/Browser.scss";
import "styles/ui/popUp.scss";
import CustomButton from "components/ui/CustomButton";
import lobbyList from "components/placeholders/lobbylist";
import NavBar from "../ui/NavBar";
import NesContainer from "../ui/NESContainer";
import "styles/views/Lobby.scss";
import NESContainerW from "../ui/NESContainerW";
import background2 from "../../assets/Backgrounds/bg2.jpeg";

const Browser = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState(lobbyList);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState(null);
  const [selectedLobby, setSelectedLobby] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
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
        navigate(`/lobby/${selectedLobby.id}`, { state: { isAdmin: false } });
      } catch (error) {
        alert(
          `Something went wrong during joining lobby: \n${handleError(error)}`
        );
      }
    } else {
      setPasswordPrompt(true);
    }
  };

  const passwordSubmit = async () => {
    try {
      await api.post("/lobbies/" + selectedLobby.id + "/authentication", {
        password,
      });
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
  const filteredLobbies = lobbies.filter((lobby) =>
    lobby.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${background2})` }}
    >
      <>
        <NavBar />
        <div className="Center">
          <NesContainer title="">
            <h1 className="press-start-font">Lobby Browser</h1>
          </NesContainer>
          <div className="Space">
            <NESContainerW title="Join a lobby" className="center style">
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
                  {filteredLobbies.map((lobby) => (
                    <tr key={lobby.id}>
                      <td className="browser-items">{lobby.name}</td>
                      <td className="browser-items">
                        {lobby.isPrivate ? "Private" : "Public"}
                      </td>
                      <td className="browser-items">{lobby.players.length}</td>
                      <td className="browser-items">{lobby.playerLimit}</td>
                      <td className="browser-items">
                        {lobby.themes.join(", ")}
                      </td>
                      <td className="browser-items">{lobby.status}</td>
                      <td className="browser-items">
                        <CustomButton
                          text="Join"
                          className="small hover-green"
                          disabled={lobby.players.length >= lobby.playerLimit}
                          onClick={() => joinLobby(lobby)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="spacing">
                <input
                  type="text"
                  placeholder="Search by lobby name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
    </div>
  );
};

export default Browser;
