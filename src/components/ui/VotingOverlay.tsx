import React from "react";
import "../../styles/ui/VotingOverlay.scss";
import CustomButton from "./CustomButton";

interface Player {
  userId: string;
  username: string;
}

interface GameResult {
  winnerRole: string;
  winners: Player[];
  losers: Player[];
}

interface VotingOverlayProps {
  players: Player[];
  onVote: (userId: string) => void;
  hasVoted: boolean;
  isVisible: boolean;
  results: GameResult | null;
  displayResults: boolean;
}

const VotingOverlay: React.FC<VotingOverlayProps> = ({
  players,
  onVote,
  hasVoted,
  isVisible,
  results,
  displayResults
}) => {
  if (displayResults && results) {
    return (
      <div className={`voting-overlay ${isVisible ? "show" : ""}`}>
        <h2>Game Results</h2>
        <p>Winner Role: {results.winnerRole}</p>
        <p>Winners: {results.winners.map(w => w.username).join(", ")}</p>
        <p>Losers: {results.losers.map(l => l.username).join(", ")}</p>
        <p>Waiting for the next round to begin or be redirected to the menu...</p>
      </div>
    );
  }

  return (
    <div className={`voting-overlay ${isVisible ? "show" : ""}`}>
      {!hasVoted ? (
        players.map(player => (
          <CustomButton text={player.username} className="hover-red" key={player.userId} onClick={() => onVote(player.userId)}/>
            
        ))
      ) : (
        <div className="waiting-message">
          Waiting for remaining players to vote...
        </div>
      )}
    </div>
  );
};

export default VotingOverlay;
