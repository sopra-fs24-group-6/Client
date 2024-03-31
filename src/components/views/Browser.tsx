import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "styles/views/Browser.scss";
import "styles/ui/popUp.scss";
import CustomButton from "components/ui/CustomButton";
import BaseContainer from "components/ui/BaseContainer";
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
    <BaseContainer>
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>Lobby Browser</h2>
      <table style={{ margin: "0 auto", textAlign: "center" }}>
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
                <CustomButton
                  text="Join"
                  className="small w100 hover-green"
                  onClick={() => joinLobby(lobby)}
                ></CustomButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "center", margin: "20px auto" }}>
        <CustomButton
          text="Refresh"
          className="small w100 hover-green"
          onClick={getLobbies}
        ></CustomButton>
      </div>

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
            <CustomButton
              text="Submit"
              className="small w100 hover-green"
              onClick={passwordSubmit}
            ></CustomButton>
            <CustomButton
              text="Cancel"
              className="small w100 hover-red"
              onClick={() => setPasswordPrompt(false)}
            ></CustomButton>
          </div>
        </div>
      )}
    </BaseContainer>
  );
};

export default Browser;
