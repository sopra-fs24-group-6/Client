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
    if (password === selectedLobby.password) {
      const userId = localStorage.getItem("id");
      await api.put("lobbies/" + selectedLobby.id, userId);
      navigate("/lobbies/" + selectedLobby.id);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Lobby Browser</h2>
      <table>
        <thead>
          <tr>
            <th>Lobby Name</th>
            <th>Lobby Type</th>
            <th>Players</th>
            <th>Player Limit</th>
            <th>Themes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lobbies.map((lobby) => (
            <tr key={lobby.id}>
              <td>{lobby.name}</td>
              <td>{lobby.password ? "Private" : "Public"}</td>
              <td>{lobby.players.length}</td>
              <td>{lobby.playerLimit}</td>
              <td>{lobby.themes.join(", ")}</td>
              <td>
                <button onClick={() => joinLobby(lobby)}>Join</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
