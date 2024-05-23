import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../ui/CustomButton";
import NESContainerW from "../ui/NESContainerW";
import NavBar from "../ui/NavBar";
import "../../styles/views/HowToPlay.scss";
import background2 from "../../assets/Backgrounds/bg2.jpeg";
import NESContainer from "components/ui/NESContainer";

const HowToPlay = () => {
  const navigate = useNavigate();

  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${background2})` }}
    >
      <>
        <NavBar />
        <div className="Center">
          <NESContainer title="">
            <h1 className="press-start-font">How to play</h1>
          </NESContainer>
        </div>
        <div className="Extension">
          <div className="center-container">
            <NESContainerW
              title=""
              className="center style scrollable"
              scrollable={true}
            >
              <h2>Find a Lobby</h2>
              <p style={{ marginBottom: "80px" }}>
                You can either{" "}
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/lobby", { state: { isAdmin: true } });
                  }}
                >
                  create a lobby
                </a>{" "}
                or{" "}
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/browser");
                  }}
                >
                  join an existing one
                </a>
                .
              </p>
              <h2>Clue Phase</h2>
              <p>
                At the beginning of each round, one player is randomly assigned
                the role of the{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>Wolf</span>.
                Everyone else is{" "}
                <span style={{ fontWeight: "bold", color: "green" }}>
                  Villagers
                </span>
                .
              </p>
              <p>The villagers all receive the clue word, the wolf does not.</p>
              <p>
                As{" "}
                <span style={{ fontWeight: "bold", color: "green" }}>
                  villagers
                </span>
                , type something that describes the clue word but isn&apos;t too
                obvious so that the
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {" "}
                  wolf
                </span>{" "}
                could figure it out.
              </p>
              <p style={{ marginBottom: "80px" }}>
                As{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>Wolf</span>,
                try to figure out what the clue word might be and blend in by
                giving fitting clues.
              </p>
              <h2>Discussion Phase</h2>
              <p>
                This is the part where you can voice your suspicions: Who gave a
                weird clue, who took too long to submit their clue, etc.
              </p>
              <p style={{ marginBottom: "80px" }}>
                Try to come to a consensus on who the wolf is.
              </p>
              <h2>Voting Phase</h2>
              <p style={{ marginBottom: "80px" }}>
                Vote for the player that you think was the wolf this round.
              </p>
              <h2>Results</h2>
              <p>The player with the most votes is exiled from the town.</p>
              <p>
                If it was the{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>wolf</span>,
                all the
                <span style={{ fontWeight: "bold", color: "green" }}>
                  {" "}
                  villagers
                </span>{" "}
                win!
              </p>
              <p style={{ marginBottom: "80px" }}>
                If it was a{" "}
                <span style={{ fontWeight: "bold", color: "green" }}>
                  villager
                </span>
                or there was a tie, only the
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {" "}
                  wolf
                </span>{" "}
                wins!
              </p>
            </NESContainerW>
            <CustomButton
              text="Back to Menu"
              className="w25 hover-green"
              onClick={() => navigate("/menu")}
            />
          </div>
        </div>
      </>
    </div>
  );
};

export default HowToPlay;
