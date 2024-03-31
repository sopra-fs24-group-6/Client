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
import useLogout from "hooks/useLogout";

const Menu = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <>
      <NavBar />
      <div className="Center">
        <NesContainer title="Welcome to">
          <h1 className="press-start-font">Word Wolf</h1>
        </NesContainer>
      </div>
      <div className="Extension">
        <NESContainerW title="Pick an option" className="center">
          <CustomButton
            text="Play"
            className="large w50 hover-green"
            onClick={() => console.log("Play button clicked!")}
          ></CustomButton>
          <div className="button-container">
            <CustomButton
              text="Create Lobby"
              className="w25 hover-green"
              onClick={() => navigate("/lobby")}
            />
            <CustomButton
              text="Game Browser"
              className="w25 hover-green"
              onClick={() => navigate("/browser")}
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
              onClick={() => logout}
            />
          </div>
        </NESContainerW>
      </div>
    </>
  );
}

export default Menu;
