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
import WoodButton from "components/ui/WoodButton";
import background1 from "../../assets/Backgrounds/bg4.jpeg";

const Menu = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${background1})` }}
    >
      <>
        <NavBar />
        <div className="Center">
          <NesContainer title="Welcome to">
            <h1 className="press-start-font">Word Wolf</h1>
          </NesContainer>
        </div>
        <div className="Extension">
          {/* <NESContainerW title="Pick an option" className="center"> */}
          <CustomButton
            text="How To Play"
            className="large w50 hover-green"
            onClick={() => navigate("/howtoplay")}
          />
          {/* <WoodButton
          text="How to play"
          className="wood wood50"
          onClick={() => navigate("/howtoplay")}/> */}
          <div className="button-container">
            <CustomButton
              text="Create Lobby"
              className="w25 hover-green"
              onClick={() => navigate("/lobby", { state: { isAdmin: true } })}
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
              onClick={() => navigate("/leaderboard")}
            />
            <CustomButton
              text="Sign out"
              className="w25 hover-red"
              onClick={() => logout()}
            />
          </div>
          {/* </NESContainerW> */}
        </div>
      </>
    </div>
  );
};

export default Menu;
