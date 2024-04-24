// import React, { useEffect, useState } from "react";
// import { subscribeToGameWebSocket } from "../../helpers/GameWebSocketManager.js";
// import { User } from "types";
// import { api, handleError } from "helpers/api";
// import ClueOverlay from "../ui/ClueOverlay";
// //import Timer from "../ui/Timer";

// const Game = () => {
//   const [phase, setPhase] = useState<string>("");
//   const [words, setWords] = useState([]); //needed with every rounstart hook
//   const [wolf, setWolf] = useState<User>(null); //needed with every rounstart hook
//   const [round, setRound] = useState(1); // needed with every roundstart hook
//   const [isCurrentPlayerTurn, setIsCurrentPlayerTurn] = useState(false);
//   const [chat, setChat] = useState([]);
//   const [roundTimer, setRoundTimer] = useState(null);
//   const [clueTimer, setClueTimer] = useState(null);
//   const [discussionTimer, setDiscussionTimer] = useState(null);
//   const [voteTimer, setVoteTimer] = useState(null);
//   const [clue, setClue] = useState("");
//   const [draftMessage, setDraftMessage] = useState("");
//   const [players, setPlayers] = useState([]);
//   const [sendMessage, setSendMessage] = useState(null);
//   const player = localStorage.getItem("userId");
//   const lobbyId = localStorage.getItem("lobbyId");

//   const isWolf = (player) => {
//     return wolf.id === player;
//   };

//   useEffect(() => {
//     const handlePlayers = (players) => {
//       setPlayers(players);
//     };
//     const handlePhase = (phase) => {
//       setPhase(phase);
//     };
//     const handleChat = (chat) => {
//       setChat(chat);
//     };

//     const handleClue = (clue) => {
//       setClue(clue);
//     };

//     const handleTurn = (turn) => {
//       setIsCurrentPlayerTurn(turn === player);
//     };

//     const handleRoundTimer = (roundTimer) => {
//       setRoundTimer(roundTimer);
//     };

//     const handleClueTimer = (clueTimer) => {
//       setClueTimer(clueTimer);
//     };

//     const handleDiscussionTimer = (discussionTimer) => {
//       setDiscussionTimer(discussionTimer);
//     };

//     const handleVoteTimer = (voteTimer) => {
//       setVoteTimer(voteTimer);
//     };

//     setSendMessage(
//       subscribeToGameWebSocket(
//         player,
//         lobbyId,
//         handlePlayers,
//         handlePhase,
//         handleChat,
//         handleClue,
//         handleTurn,
//         handleRoundTimer,
//         handleClueTimer,
//         handleDiscussionTimer,
//         handleVoteTimer
//       )
//     );
//   }, []);

//   return (
//     <div>
//       <h2>Phase: {phase}</h2>
//       {phase === "clue" && (
//         <ClueOverlay isWolf={isWolf(player)} words={words} round={round} />
//       )}
//       <div>
//         {isWolf ? (
//           <p>You are the wolf! Try to blend in.</p>
//         ) : (
//           <p>This round&apos;s word is: {clue}</p>
//         )}
//       </div>
//       <div>
//         {phase === "clue" && <p>Time remaining:{roundTimer} seconds</p>}
//       </div>
//       <div>
//         {phase === "clue" && isCurrentPlayerTurn && (
//           <>
//             <p>Time remaining: {clueTimer} seconds</p>
//             {/* <input
//               type="text"
//               placeholder="Enter your clue"
//               onChange={(e) => sendMessage(e.target.value)}
//             /> */}
//           </>
//         )}
//       </div>
//       <div
//         id="messageList"
//         style={{
//           height: "200px",
//           overflowY: "scroll",
//           marginBottom: "20px",
//           border: "1px solid #ccc",
//           padding: "10px",
//         }}
//       >
//         {chat.map((msg, index) => (
//           <div key={index}>
//             {msg.userId}: {msg.content}
//           </div>
//         ))}
//       </div>
//       {phase === "clue" && (
//         <>
//           <input
//             type="text"
//             value={draftMessage}
//             onChange={(e) => setDraftMessage(e.target.value)}
//             disabled={!isCurrentPlayerTurn}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Type a clue..."
//             style={{ width: "80%", marginRight: "10px" }}
//           />
//           <button onClick={sendMessage} disabled={!isCurrentPlayerTurn}>
//             Send
//           </button>
//         </>
//       )}
//       {phase === "discussion" && (
//         <>
//           <input
//             type="text"
//             value={draftMessage}
//             onChange={(e) => setDraftMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Type a message..."
//             style={{ width: "80%", marginRight: "10px" }}
//           />
//           <button onClick={sendMessage}>Send</button>
//         </>
//       )}

//       {/* {phase === "vote" && (
//         <div>
//           {players.map((player) => (
//             <div key={player.id}>
//               <p>{player.name}</p>
//               <button onClick={() => handleVote(player.id)}>Vote</button>
//             </div>
//           ))}
//         </div>
//       )} */}
//     </div>
//   );
// };
// export default Game;
