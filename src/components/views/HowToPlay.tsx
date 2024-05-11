import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../ui/CustomButton";
import NESContainerW from "../ui/NESContainerW";
import NavBar from "../ui/NavBar";

const HowToPlay = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div className="Extension">
        <NESContainerW title="How To Play" className="center">
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
            At the beginning of each round, one player is randomly assigned the
            role of the{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>wolf</span>.
            Everyone else is{" "}
            <span style={{ fontWeight: "bold", color: "green" }}>sheep</span>.
          </p>
          <p>The sheep all see the clue word, the wolf does not.</p>
          <p>
            As <span style={{ fontWeight: "bold", color: "green" }}>sheep</span>
            , type something that describes the clue word but isn&apos;t too
            obvious so that the
            <span style={{ fontWeight: "bold", color: "red" }}> wolf</span>{" "}
            could figure it out.
          </p>
          <p style={{ marginBottom: "80px" }}>
            As <span style={{ fontWeight: "bold", color: "red" }}>Wolf</span>,
            try to figure out what the clue word might be and blend in by giving
            fitting clues.
          </p>
          <h2>Discussion Phase</h2>
          <p>
            This is the part where you can voice your suspicions: Who gave a
            weird clue, who took too long to submit their clue, etc.
          </p>
          <p style={{ marginBottom: "80px" }}>
            Try to come to a consensus on who the wolf was.
          </p>
          <h2>Voting Phase</h2>
          <p style={{ marginBottom: "80px" }}>
            Vote for the player that you think was the wolf this round.
          </p>
          <h2>Results</h2>
          <p>The player with the most votes is exiled from the herd.</p>
          <p>
            If it was the{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>wolf</span>, all
            the
            <span style={{ fontWeight: "bold", color: "green" }}>
              {" "}
              sheep
            </span>{" "}
            win!
          </p>
          <p style={{ marginBottom: "80px" }}>
            If it was a{" "}
            <span style={{ fontWeight: "bold", color: "green" }}>sheep</span>,
            only the
            <span style={{ fontWeight: "bold", color: "red" }}> wolf</span>{" "}
            wins!
          </p>
          <CustomButton
            text="Back to Menu"
            className="w25 hover-green"
            onClick={() => navigate("/menu")}
          />
        </NESContainerW>
      </div>
    </>
  );
};

export default HowToPlay;
