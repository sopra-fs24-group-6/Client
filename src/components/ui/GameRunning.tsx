// GameView.tsx
import React, { useState } from 'react';
import Timer from './Timer.tsx';
import Player from './Player.tsx';
import Overlay from './Overlay.tsx';
import ClueInput from './ClueInput.tsx';
import VotingOverlay from './VotingOverlay.tsx';
import CluesDisplay from './CluesDisplay.tsx';
import ResultOverlay from './ResultOverlay.tsx';
import "../styles/ui/GameView.scss";

// const GameView: React.FC = () => {
//   // State related to the game's players
//   const [players, setPlayers] = useState([
//     { id: 1, name: 'Player 1', hasWord: true },
//     { id: 2, name: 'Player 2', hasWord: true },
//     { id: 3, name: 'Player 3', hasWord: true },
//     { id: 4, name: 'Player 4', hasWord: false }, // This player doesn't have the word
//   ]);

//   // State related to the game's status
//   const [gameStarted, setGameStarted] = useState(false);
//   const [showOverlay, setShowOverlay] = useState(true);
//   const [inVotingPhase, setInVotingPhase] = useState(false);
//   const [currentPlayer, setCurrentPlayer] = useState(0); // Index of the current player
//   const [word, setWord] = useState('Lion'); // The word to be guessed
//   const [clues, setClues] = useState([]); // Array to store clues

//   // Handlers for game events
//   const handleOverlayEnd = () => {
//     setShowOverlay(false);
//     setGameStarted(true);
//   };

//   const handleTimerExpire = () => {
//     setGameStarted(false);
//     setInVotingPhase(true);
//   };

//   const handleVote = (playerId: number) => {
//     console.log(`Votes for player ${playerId}`);
//     setInVotingPhase(false);
//     // Transition to show the results or start a new round
//   };

//   const handleClueSubmit = (clue: string) => {
//     setClues([...clues, { player: `Player ${currentPlayer + 1}`, clue }]);
//     setCurrentPlayer((currentPlayer + 1) % players.length);
//   };

//   // GameView rendering
//   return (
//     <div className={`game-view ${!gameStarted && !inVotingPhase ? 'disabled' : ''}`}>
//       {showOverlay && <Overlay word={word} onEnd={handleOverlayEnd} />}
      
//       {inVotingPhase && (
//         <VotingOverlay players={players} onVote={handleVote} isVisible={inVotingPhase} />
//       )}

//       {gameStarted && (
//         <>
//           {players[currentPlayer].id === 1 && (
//             <div className="clue-input-container">
//               <ClueInput onSubmitClue={handleClueSubmit} isActive={true} />
//             </div>
//           )}

//           <Timer duration={30} onExpire={handleTimerExpire} />
//           <CluesDisplay clues={clues} />
//         </>
//       )}

//       <div className="players">
//         {players.map((player) => (
//           <Player
//             key={player.id}
//             name={player.name}
//             word={player.hasWord && player.id === 1 ? word : undefined}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GameView;

interface Clue {
  player: string;
  clue: string;
}

const GameView: React.FC = () => {
  const myPlayerId = 1; // Assume you are Player 1

  // State for various aspects of the game
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', hasWord: true },
    { id: 2, name: 'Player 2', hasWord: true },
    { id: 3, name: 'Player 3', hasWord: true },
    { id: 4, name: 'Player 4', hasWord: false }, // This player doesn't have the word
  ]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [inVotingPhase, setInVotingPhase] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [word, setWord] = useState('Lion');
  const [clues, setClues] = useState<Clue[]>([]);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [voteOutcome, setVoteOutcome] = useState<'lost' | 'won' | null>(null);
  const [votedOutPlayerId, setVotedOutPlayerId] = useState<number | null>(null);



  // Function to handle the end of the overlay, starting the game
  const handleOverlayEnd = () => {
    setShowOverlay(false);
    setGameStarted(true);
  };

  // Function to handle the expiration of the timer, ending the game
  const handleTimerExpire = () => {
    setGameStarted(false);
    setInVotingPhase(true);
  };

  // Function to handle when a vote is cast
// Function to handle when a vote is cast
// Function to handle when a vote is cast
// Inside GameView component

// Function to handle when a vote is cast
const handleVote = (playerId: number) => {
  console.log(`Votes for player ${playerId}`);
  
  // Simulate checking if the voted-out player is the correct one.
  // Replace with your actual game logic to determine the result.
  const playerVotedOut = players.find((player) => player.id === playerId);
  if (playerVotedOut) {
    // Assuming 'hasWord' determines if they were the player to be found
    const outcome = playerVotedOut.hasWord ? 'lost' : 'won';
    setVoteOutcome(outcome);
    setVotedOutPlayerId(playerId);
    setShowResultOverlay(true); // Show result overlay
    setResultMessage(`Player ${playerId} has ${outcome} the game.`);
  } else {
    // Handle the case where no player is found
    console.error(`No player found with ID: ${playerId}`);
  }
};





  // Function to handle clue submission
  const handleClueSubmit = (clue: string) => {
    const playerName = `Player ${currentPlayer + 1}`;
    setClues([...clues, { player: playerName, clue }]);
    setCurrentPlayer((currentPlayer + 1) % players.length);
  };



  return (
    <div className={`game-view ${!gameStarted && !inVotingPhase ? 'disabled' : ''}`}>
      {showOverlay && <Overlay word={word} onEnd={handleOverlayEnd} />}
      {inVotingPhase && <VotingOverlay players={players} onVote={handleVote} isVisible={inVotingPhase} />}

      {/* Use ResultOverlay instead of Overlay for result messages */}
      {showResultOverlay && (
        <ResultOverlay
          message={resultMessage}
          onEnd={() => {
            setShowResultOverlay(false);  // Hide the result overlay
            // Additional logic to reset the game or proceed to the next round
          }}
        />
      )}

      <CluesDisplay clues={clues} />

      <div className="players">
        {players.map(player => (
          <Player
            key={player.id}
            name={player.name}
            word={gameStarted && player.id === myPlayerId && player.hasWord ? word : undefined}
          />
        ))}
      </div>

      {gameStarted && players[currentPlayer].id === myPlayerId && (
        <div className="clue-input-container">
          <ClueInput onSubmitClue={handleClueSubmit} isActive={true} />
        </div>
      )}

      {gameStarted && <Timer duration={30} onExpire={handleTimerExpire} />}
    </div>
  );

};

export default GameView;