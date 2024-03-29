import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "styles/views/Browser.scss";
import "styles/ui/popUp.scss";
import lobbyList from "components/placeholders/lobbylist";

const Browser = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState(lobbyList);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState(null);
  const [selectedLobby, setSelectedLobby] = useState(null);

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
    const userId = localStorage.getItem("id");
    if (!selectedLobby.password) {
      await api.put("lobbies/" + selectedLobby.id, userId);
      navigate("/lobbies/" + selectedLobby.id);
    } else {
      setPasswordPrompt(true);
    }
  };

  const passwordSubmit = async () => {
    try {
      await api.post("/lobbies" + selectedLobby.id + "authenticate,", password);
      const userId = localStorage.getItem("id");
      await api.put("lobbies/" + selectedLobby.id, userId);
      navigate("/lobbies/" + selectedLobby.id);
    } catch (error) {
      alert(
        `Something went wrong during the authentifiation: \n${handleError(
          error
        )}`
      );
    }
  };

  return (
    <div className="container">
      <h2>Lobby Browser</h2>
      <table>
        <thead>
          <tr>
            <th style={{ width: "auto", padding: "10px", textAlign: "center" }}>
              Lobby Name
            </th>
            <th style={{ width: "auto", padding: "10px", textAlign: "center" }}>
              Lobby Type
            </th>
            <th style={{ width: "auto", padding: "10px", textAlign: "center" }}>
              Players
            </th>
            <th style={{ width: "auto", padding: "10px", textAlign: "center" }}>
              Player Limit
            </th>
            <th style={{ width: "auto", padding: "10px", textAlign: "center" }}>
              Themes
            </th>
            <th
              style={{ width: "auto", padding: "10px", textAlign: "center" }}
            ></th>
          </tr>
        </thead>
        <tbody>
          {lobbies.map((lobby) => (
            <tr key={lobby.id}>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {lobby.name}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {lobby.password ? "Private" : "Public"}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {lobby.players.length}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {lobby.playerLimit}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {lobby.themes.join(", ")}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                <button onClick={() => joinLobby(lobby)}>Join</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={getLobbies}>Refresh</button>

      {/* Password Prompt Popup */}
      {passwordPrompt && (
        <div className="popup-container">
          <div className="popup">
            <input
              type="password"
              placeholder="Enter lobby password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={passwordSubmit}>Submit</button>
            <button onClick={() => setPasswordPrompt(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browser;
