import React from "react";
import { useNavigate } from "react-router-dom";
//import "./styles/App.css";
import "../../styles/ui/AppBody.scss";
import NesContainer from "../ui/NESContainer";
import NavBar from "../ui/NavBar";
import "../../styles/ui/Fonts.scss";
import "../../styles/ui/CustomButton.scss";
import NESContainerW from "../ui/NESContainerW";
import CustomButton from "../ui/CustomButton";

const Menu = () => {
  return (
    <>
      <NavBar />
      <div className="App">
        <NesContainer title="Welcome to">
          <h1 className="press-start-font">Word Wolf</h1>
        </NesContainer>
      </div>
      <div className="Extension">
        <NESContainerW title="Pick an option">
          <CustomButton
            text="Play"
            className="large w50 hover-green"
            onClick={() => console.log("Play button clicked!")}
          ></CustomButton>
          <div className="button-container">
            <CustomButton
              text="Create Lobby"
              className="w25 hover-green"
              onClick={() => console.log("Create Lobby button clicked!")}
            />
            <CustomButton
              text="Game Browser"
              className="w25 hover-green"
              onClick={() => console.log("Game Browser button clicked!")}
            />
          </div>
          <div className="button-container">
            <CustomButton
              text="Leaderboard"
              className="w25 hover-orange"
              onClick={() => console.log("Create Lobby button clicked!")}
            />
            <CustomButton
              text="Sign out"
              className="w25 hover-red"
              onClick={() => console.log("Game Browser button clicked!")}
            />
          </div>
        </NESContainerW>
      </div>
    </>
  );
}

export default Menu;
