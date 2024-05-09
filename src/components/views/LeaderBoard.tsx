import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "styles/views/Browser.scss";
import "styles/ui/popUp.scss";
import CustomButton from "components/ui/CustomButton";
import BaseContainer from "components/ui/BaseContainer";
import leaderList from "components/placeholders/leaderlist";
import NavBar from "../ui/NavBar";
import NesContainer from "../ui/NESContainer";
import "styles/views/Lobby.scss";
import NESContainerW from "../ui/NESContainerW";
import { getDomain } from "helpers/getDomain";

const LeaderBoard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(leaderList);
  // Initialize timestamp only once
  const [timestamp] = useState(new Date().getTime());

  //*** For Testing Purposes***
  useEffect(() => {
    // Immediately-invoked function expression (IIFE) with an async function
    (async () => {
      try {
        const response = await api.get("/leaderboard");
        setPlayers(response.data);
        console.log(response.data)
      } catch (error) {
        alert(`Something went wrong when trying to fetch available lobbies: \n${handleError(error)}`);
      }
    })();
  }, []);

  const getTopPlayers = async () => {
    try {
      const response = await api.get("/leaderboard");
      setPlayers(response.data);
    } catch (error) {
      alert(
        `Something went wrong when trying to fetch available lobbies: \n${handleError(
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
          <h1 className="press-start-font">Leader Board</h1>
        </NesContainer>
        <div className="Space">
          <NESContainerW title="LeaderBoard" className="center">
            <table style={{ margin: "0 auto", textAlign: "center" }}>
              <thead>
                <tr>
                  <th className="table-header"> User Name</th>
                  <th className="table-header">Wins</th>
                  <th className="table-header">Losses</th>
                  <th className="table-header">WinLossRatio</th>
                  <th className="table-header">Ranking</th>
                  <th className="table-header"></th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.id}>
                    <td className="browser-items">
                    <img
                      src={getDomain() + "/" +  player.avatarUrl + `?v=${timestamp}`} // Replace with the actual default image path
                      alt={`${player.username}'s avatar`}
                      style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "8px" }}
                    />
                      {player.username}
                    </td>
                    <td className="browser-items">
                      {player.wins}
                    </td>
                    <td className="browser-items">
                      {player.losses}
                    </td>
                    <td className="browser-items">
                      {player.winlossratio.toFixed(2)}
                    </td>
                    <td className="browser-items">
                      {index + 1}
                    </td>
                    {/* 
                    we could change this to friend invitation function
                    <td className="browser-items">
                      <CustomButton
                        text="Join"
                        className="small hover-green"
                        onClick={() => joinLobby(lobby)}
                      />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <CustomButton
                    text="Back"
                    className="small hover-green"
                    onClick={() => navigate(-1)}
                  />
          </NESContainerW>
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;
