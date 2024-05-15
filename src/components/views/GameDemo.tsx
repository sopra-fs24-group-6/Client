import React, { useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import { Client } from "@stomp/stompjs";
import { getBrokerURL } from "helpers/getBrokerURL";
import { useNavigate } from "react-router-dom";

import RoleWordOverlay from "components/ui/RoleWordOverlay";
import NESContainerW from "components/ui/NESContainerW";
import "../../styles/ui/GameDemo.scss";
import VotingOverlay from "components/ui/VotingOverlay";
import InfoBar from "components/ui/InfoBar";
import NESContainer from "components/ui/NESContainer";
import PlayerIcons from "components/ui/PlayerIcons";
import TimerDisplay from "components/ui/TimerDisplay";

const GameDemo = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [roundTimer, setRoundTimer] = useState(0);
  const [clueTimer, setClueTimer] = useState(0);
  const [discussionTimer, setDiscussionTimer] = useState(0);
  const [clueMessages, setClueMessages] = useState([]);
  const [phase, setPhase] = useState<string>("");
  const [isWolf, setIsWolf] = useState(null);
  const [word, setWord] = useState("");
  const [isCurrentPlayerTurn, setIsCurrentPlayerTurn] = useState(false);
  const [players, setPlayers] = useState([]);
  const [hasAlreadyVoted, setHasAlreadyVoted] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const lobbyId = localStorage.getItem("lobbyId");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(null);
  const [maxRound, setMaxRound] = useState(null);

  const chatLogRef = useRef(null);
  const clueLogRef = useRef(null);
  const [role, setRole] = useState("");

  const [roleOverlay, setRoleOverlay] = useState<boolean>(true);
  const [voteOverlay, setVoteOverlay] = useState<boolean>(false);
  const [showResults, setShowResults] = useState(false);
  const [draftChatMessage, setDraftChatMessage] = useState("");
  const [draftClueMessage, setDraftClueMessage] = useState("");
  const [playerTurn, setPlayerTurn] = useState("");
  const [startPlayers, setStartPlayers] = useState([]);

  useEffect(() => {
    const playerGetter = async () => {
      const id = localStorage.getItem("lobbyId");
      try {
        const response = await api.get(`/lobbies/${id}/players`);
        setStartPlayers(response.data);
      } catch (error) {
        alert(`Couldn't fetch players in the lobby: \n${handleError(error)}`);
      }
    };

    playerGetter();
  }, []);

  useEffect(() => {
    const overlayTimer = setTimeout(() => {
      setRoleOverlay(false);
    }, 8000);

    return () => clearTimeout(overlayTimer);
  }, []);

  useEffect(() => {
    if (phase === "vote") {
      setVoteOverlay(true);
    } else if (phase === "roundResult") {
      setVoteOverlay(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "roundResult") {
      setVoteOverlay(true);
      setShowResults(true);
    }
  }, [phase, gameResult]);

  const scrollClue = () => {
    if (clueLogRef.current) {
      clueLogRef.current.scrollTop = clueLogRef.current.scrollHeight;
    }
  };

  const scrollChat = () => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollChat();
  }, [chatMessages]);

  useEffect(() => {
    scrollClue();
  }, [clueMessages]);

  // const renderVotingButtons = () => {
  //   // if (phase !== "vote") {
  //   //   return null;
  //   // }

  //   return (
  //     <div className="voting-container">
  //       {players.map((player) => (
  //         <button
  //           key={player.userId}
  //           onClick={() => sendVote(player.userId)}
  //           disabled={hasAlreadyVoted}
  //         >
  //           <span className="player-name">{player.username}</span>
  //           <span className="vote-text">{hasAlreadyVoted ? "Voted" : "Vote"}</span>
  //         </button>
  //       ))}
  //     </div>
  //   );
  // };

  // const handleHover = (event) => {
  //   if (!isCurrentPlayerTurn || hasAlreadyVoted || phase !== "vote") {
  //     event.target.style.cursor = "not-allowed";
  //   }
  // };

  // const renderVotingButtonsWithHover = () => {
  //   return players.map((player) => (
  //     <div key={player.userId} onMouseOver={handleHover}>
  //       <button
  //         key={player.userId}
  //         disabled={!isCurrentPlayerTurn || hasAlreadyVoted || phase !== "vote"}
  //         onClick={() => sendVote(player.userId)}
  //         className="voting-button"
  //       >
  //         {player.username}
  //       </button>
  //     </div>
  //   ));
  // };

  const renderPlayerButtons = () => {
    return players.map((player) => (
      <button
        key={player.userId}
        className={`button ${player.isTurn ? "active-turn" : ""}`}
        disabled={!player.isTurn}
      >
        {player.username}
      </button>
    ));
  };

  // these settings are for demo. userId and lobbyId should be set appropriately.
  // const [userId, setUserId] = useState("");
  // const [userIdInput, setUserIdInput] = useState("");
  // const [isUserIdSet, setIsUserIdSet] = useState(false);
  // const lobbyId = "1";

  /**
   * WebSocket Notes
   *
   * Send message to server:
   *   client.publish({
   *     destination: `/app/endpoint`,
   *     body: JSON
   *   });
   *
   * Receive public message from server:
   *   stompClient.subscribe(`/topic/endpoint`, (message) => {
   *     const event = JSON.parse(message.body);
   *   });
   *
   * Receive private message from server:
   *   stompClient.subscribe(`/queue/{userId}/endpoint`, (message) => {
   *     const event = JSON.parse(message.body);
   *   });
   */
  useEffect(() => {
    // Connect WebSocket
    const stompClient = new Client({
      // url is defined in helper/getBrokerURL.js
      brokerURL: getBrokerURL(),
      connectHeaders: { userId },
      onConnect: () => {
        console.log("Connected");
        console.log(lobbyId);
        console.log(userId);
        setConnected(true);

        // subscribe game events
        // message has eventType<String>, like "startGame", "startRound".
        stompClient.subscribe(`/topic/${lobbyId}/gameEvents`, (message) => {
          const event = JSON.parse(message.body);
          setPhase(event.eventType);
          if (event.eventType === "startRound") {
            setHasAlreadyVoted(false);
            setCurrentRound(event.currentRound);
            setMaxRound(event.maxRound);
            setShowResults(false);
            setVoteOverlay(false);
          }
          // if (event.eventType === "vote") {
          //   setVoteOverlay(true);
          // }
          if (event.eventType === "endGame") {
            //setVoteOverlay(false);
            navigate("/menu");
          }
        });

        // subscribe chat
        // message has content<String>, userId<Long>, username<String>
        stompClient.subscribe(`/queue/${userId}/chat`, (message) => {
          const newChatMessage = JSON.parse(message.body);
          setChatMessages((prevChatMessages) => [
            ...prevChatMessages,
            newChatMessage,
          ]);
        });

        // subscribe clue
        // message has content<String>, userId<Long>, username<String>
        stompClient.subscribe(`/queue/${userId}/clue`, (message) => {
          const newClueMessage = JSON.parse(message.body);
          setClueMessages((prevClueMessages) => [
            ...prevClueMessages,
            newClueMessage,
          ]);
        });

        // subscribe round timer
        // message has single integer, which indicates remaining seconds
        stompClient.subscribe(`/topic/${lobbyId}/roundTimer`, (message) => {
          const newRoundTime = JSON.parse(message.body);
          setRoundTimer(newRoundTime);
        });

        // subscribe clue timer
        // message has single integer, which indicates remaining seconds
        stompClient.subscribe(`/topic/${lobbyId}/clueTimer`, (message) => {
          const newClueTime = JSON.parse(message.body);
          setClueTimer(newClueTime);
        });

        // subscribe discussion timer
        // message has single integer, which indicates remaining seconds
        stompClient.subscribe(
          `/topic/${lobbyId}/discussionTimer`,
          (message) => {
            const newDiscussionTime = JSON.parse(message.body);
            setDiscussionTimer(newDiscussionTime);
          }
        );

        // subscribe clue turn
        // message has userId<Long>
        stompClient.subscribe(`/topic/${lobbyId}/clueTurn`, (message) => {
          const event = JSON.parse(message.body);
          setPlayerTurn(event.userId);
          setIsCurrentPlayerTurn(String(event.userId) === String(userId));

          const turnUserId = JSON.parse(message.body).userId;
          setPlayers(currentPlayers =>
            currentPlayers.map(player => ({
              ...player,
              isTurn: player.userId === turnUserId
            }))
          );
        });

        // subscribe game result
        // message has winnerRole<String>, winners<List<PlayerDTO>>, losers<List<PlayerDTO>>. PlayerDTO has userId and username
        stompClient.subscribe(`/topic/${lobbyId}/result`, (message) => {
          const event = JSON.parse(message.body);
          console.log(event);
          setGameResult(event);
        });

        // subscribe word assignment
        // message has word<String>. if null, it indicates Wolf.
        stompClient.subscribe(`/queue/${userId}/wordAssignment`, (message) => {
          const event = JSON.parse(message.body);
          if (event.word === null) {
            setIsWolf(true);
            setRole("Wolf");
          } else {
            setIsWolf(false);
            setRole("Villager");
          }
          setWord(event.word);
        });

        // subscribe players
        // message has List<PlayerDTO>, PlayerDTO has userId and username
        stompClient.subscribe(`/topic/${lobbyId}/players`, (message) => {
          const event = JSON.parse(message.body);
          setPlayers(event);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
        setConnected(false);
      },
    });
    stompClient.activate();
    setClient(stompClient);

    // if close window or move to another page, then disconnect
    const handleBeforeUnload = () => {
      stompClient.deactivate();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      stompClient.deactivate();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId]);

  const sendMessage = () => {
    if (client && connected && draftChatMessage) {
      const chatMessage = {
        content: draftChatMessage,
        userId: userId,
        lobbyId: lobbyId,
      };
      client.publish({
        destination: `/app/chat/${lobbyId}/sendMessage`,
        body: JSON.stringify(chatMessage),
      });
      setDraftChatMessage("");
    } else {
      console.log("STOMP connection is not established.");
    }
  };

  const sendClue = () => {
    if (client && connected && draftClueMessage) {
      const normalizedDraftMessage = draftMessage
        .toLowerCase()
        .replace(/\s/g, "");
      const normalizedWord = word.toLowerCase().replace(/\s/g, "");

      if (
        normalizedDraftMessage === normalizedWord ||
        normalizedDraftMessage.includes(normalizedWord)
      ) {
        console.log(
          "Clue cannot be submitted. It is equal or too similar to the word."
        );

        return;
      }
      const clueMessage = {
        content: draftClueMessage,
        userId: userId,
        lobbyId: lobbyId,
      };
      client.publish({
        destination: `/app/clue/${lobbyId}/sendMessage`,
        body: JSON.stringify(clueMessage),
      });
      setDraftClueMessage("");
    } else {
      console.log("STOMP connection is not established.");
    }
  };

  const sendVote = (votedUserId) => {
    if (client && connected) {
      const voteMessage = {
        voterUserId: userId,
        votedUserId: votedUserId,
      };
      client.publish({
        destination: `/app/vote/${lobbyId}/sendVote`,
        body: JSON.stringify(voteMessage),
      });
      setDraftMessage("");
      setHasAlreadyVoted(true);
    } else {
      console.log("STOMP connection is not established.");
    }
  };
  
  return (
    <>
      <div className="Center">
        <NESContainer title="Play">
          <h1 className="press-start-font">Word Wolf</h1>
        </NESContainer>
      </div>
      <div className="main-container">
        <RoleWordOverlay isVisible={roleOverlay} word={word} isWolf={isWolf} />
        <div className="container1">
          <div className="container1-top">
            <h1>{word || "Role: " + role}</h1>
            <div className="info-container">
              <TimerDisplay label={phase !== "discussion" ? "Round time" : "Discussion time"} timer={phase !== "discussion" ? roundTimer : discussionTimer} />
              <p>Role: {role}</p>
            </div>
          </div>
          <PlayerIcons players={players} />
        </div>
        {voteOverlay && (
          <VotingOverlay
            players={players}
            onVote={sendVote}
            hasVoted={hasAlreadyVoted}
            isVisible={voteOverlay}
            results={gameResult}
            displayResults={showResults}
          />
        )}
        <div className="container2">
          <h3>Clues</h3>
          <div className="log-area" ref={clueLogRef}>
            {clueMessages.map((msg, index) => (
              <div key={index}>{msg.username}: {msg.content}</div>
            ))}
          </div>
          <input
            type="text"
            value={draftClueMessage}
            onChange={(e) => setDraftClueMessage(e.target.value)}
            disabled={phase !== "clue" || !isCurrentPlayerTurn}
            onKeyPress={(e) => e.key === "Enter" && sendClue()}
            placeholder="Type a clue..."
            style={{ width: "80%", marginRight: "10px" }}
          />
          <button onClick={sendClue} disabled={phase !== "clue" || !isCurrentPlayerTurn}>Send</button>
          <hr className="hr" />
          <h3>Chat</h3>
          <div className="log-area" ref={chatLogRef}>
            {chatMessages.map((msg, index) => (
              <div key={index}>{msg.username}: {msg.content}</div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={draftChatMessage}
              onChange={(e) => setDraftChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              disabled={phase !== "discussion"}
              style={{ width: "80%", marginRight: "10px" }}
            />
            <button onClick={sendMessage} disabled={phase !== "discussion"}>Send</button>
          </div>
        </div>
        <InfoBar currentPlayer={playerTurn} role={role} word={word} clueTimer={clueTimer} />
      </div>
    </>
  );
};

export default GameDemo;

//   return (
//     <div>
//       {/* This is for demo to set userId manually */}
//       {/*<div>*/}
//       {/*  <button onClick={startGame}>StartGame</button>*/}
//       {/*</div>*/}
//       {/*{!isUserIdSet && (*/}
//       {/*  <>*/}
//       {/*    <input*/}
//       {/*      type="number"*/}
//       {/*      value={userIdInput}*/}
//       {/*      onChange={(e) => setUserIdInput(e.target.value)}*/}
//       {/*      placeholder="Enter your userId..."*/}
//       {/*    />*/}
//       {/*    <button onClick={setUserIdAndHide}>Set UserId</button>*/}
//       {/*  </>*/}
//       {/*)}*/}
//       {/*{isUserIdSet && (*/}
//       {/*  <div>Your userId is {userId}</div>*/}
//       {/*)}*/}
//       {/*<hr/>*/}

//       {/* Display phase */}
//       <h2>Phase: {phase}</h2>
//       <h2>Round: {currentRound}/{maxRound}</h2>

//       {/* Assigned word and role  */}
//       <div>
//         {isWolf === null ? (
//           <></>
//         ) : isWolf ? (
//           <p>You are the wolf! Try to blend in.</p>
//         ) : (
//           <p>This round&apos;s word is: {word}</p>
//         )}
//     {/* // Check from here how to use multiple rounds on the display end
//         // */}
//     <>
//       <div className="Center">
//         <NESContainer title="Play">
//           <h1 className="press-start-font">Word Wolf</h1>
//         </NESContainer>
// //
//       </div>
//       <div className="main-container">
//         <RoleWordOverlay isVisible={roleOverlay} word={word} isWolf={isWolf} />
//         <div className="container1">
//           <div className="container1-top">
//             {word ? (
//               <div className="top-section">
//                 <h1>{word}</h1>
//                 <div className="info-container">
//                   {phase !== "discussion" ? (
//                     <TimerDisplay label="Round time" timer={roundTimer} />
//                   ) : (
//                     <TimerDisplay label="Discussion time" timer={discussionTimer} />
//                   )}
//                   <p>Role: {role}</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="top-section">
//                 <h1>Role: {role}</h1>
//                 <div className="info-container2">
//                   {phase !== "discussion" ? (
//                     <TimerDisplay label="Round time" timer={roundTimer} />
//                   ) : (
//                     <TimerDisplay label="Discussion time" timer={discussionTimer} />
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//           {/* <div className="player-buttons">
//             {renderPlayerButtons()}
//           </div> */}
//           {/* <PlayerIcons players={startPlayers} /> */}
//           <div className="container3">
//             <PlayerIcons players={startPlayers} />
//           </div>
//         </div>
//         {voteOverlay && (
//           <VotingOverlay
//             players={players}
//             onVote={sendVote}
//             hasVoted={hasAlreadyVoted}
//             isVisible={voteOverlay}
//             results={gameResult}
//             displayResults={showResults}
//           />
//         )}
//         <div className="container2">
//           <h3>Clues</h3>
//           <div className="log-area" ref={clueLogRef}>
//             {clueMessages.map((msg, index) => (
//               <div key={index}>{msg.username}: {msg.content}</div>
//             ))}
//           </div>
//           <input
//             type="text"
//             value={draftClueMessage}
//             onChange={(e) => setDraftClueMessage(e.target.value)}
//             disabled={phase !== "clue" || !isCurrentPlayerTurn}
//             onKeyPress={(e) => e.key === "Enter" && sendClue()}
//             placeholder="Type a clue..."
//             style={{ width: "80%", marginRight: "10px" }}
//           />
//           <button onClick={sendClue} disabled={phase !== "clue" || !isCurrentPlayerTurn}>Send</button>
//           <hr className="hr" />
//           <h3>Chat</h3>
//           <div className="log-area" ref={chatLogRef}>
//             {chatMessages.map((msg, index) => (
//               <div key={index}>{msg.username}: {msg.content}</div>
//             ))}
//           </div>
//           <div className="input-area">
//             <input
//               type="text"
//               value={draftChatMessage}
//               onChange={(e) => setDraftChatMessage(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Type a message..."
//               disabled={phase !== "discussion"}
//               style={{ width: "80%", marginRight: "10px" }}
//             />
//             <button onClick={sendMessage} disabled={phase !== "discussion"}>Send</button>
//           </div>
//         </div>
//         {/* //check */}
//       )}
//       {phase === "vote" && hasAlreadyVoted && (
//         <p>You have voted. Please wait for voting of other players.</p>
//       )}

//       {/* Result */}
//       {phase === "roundResult" && gameResult && (
//         <div>
//           <p>Winner role: {gameResult.winnerRole}</p>
//           <p>Winners: {gameResult.winners.map(w => `${w.username}`).join(", ")}</p>
//           <p>Losers: {gameResult.losers.map(l => `${l.username}`).join(", ")}</p>
//         </div>
//       )}

//       {/* Clue and Chat log */}
//       <p>Clue log</p>
//       <div id="messageList" style={{ height: "200px", overflowY: "scroll", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
//         {clueMessages.map((msg, index) => (
//           <div key={index}>{msg.username}: {msg.content}</div>
//         ))}
// {/* // check how to display multiple rounds */}
//         <InfoBar currentPlayer={playerTurn} role={role} word={word} clueTimer={clueTimer} />
//       </div>
//     </>
//   );
// };

// export default GameDemo;

{/* // const startGame = () => {
//   if (client && connected) {
//     client.publish({
//       destination: "/app/startGame",
//       body: JSON.stringify({ lobbyId, userId }),
//     });
//   } else {
//     console.log("STOMP connection is not established.");
//   }
// }

// this function is for demo and should be deleted.
// const setUserIdAndHide = () => {
//   setUserId(userIdInput);
//   setIsUserIdSet(true);
// };


// return (
//   <div>
//     {/* This is for demo to set userId manually */}
//     {/*<div>*/}
//     {/*  <button onClick={startGame}>StartGame</button>*/}
//     {/*</div>*/}
//     {/*{!isUserIdSet && (*/}
//     {/*  <>*/}
//     {/*    <input*/}
//     {/*      type="number"*/}
//     {/*      value={userIdInput}*/}
//     {/*      onChange={(e) => setUserIdInput(e.target.value)}*/}
//     {/*      placeholder="Enter your userId..."*/}
//     {/*    />*/}
//     {/*    <button onClick={setUserIdAndHide}>Set UserId</button>*/}
//     {/*  </>*/}
//     {/*)}*/}
//     {/*{isUserIdSet && (*/}
//     {/*  <div>Your userId is {userId}</div>*/}
//     {/*)}*/}
//     {/*<hr/>*/}

{/* Display phase */ }
// <div>
//   <RoleWordOverlay isVisible={roleOverlay} word={word} isWolf={isWolf} />
// </div>
// <div>
//   <NESContainerW title={phase}>
//     <div className="info-section">
//       <h1>{word}</h1>
//       <div className="timers">
//         <p>Round Time: {roundTimer}s</p>
//         <p>Clue Time: {clueTimer}s</p>
//       </div>
//     </div>
//   </NESContainerW>
//   {voteOverlay && (
//     <VotingOverlay
//       players={players}
//       onVote={sendVote}
//       hasVoted={hasAlreadyVoted}
//       isVisible={voteOverlay}
//       results={gameResult}
//       displayResults={showResults}
//     />
//   )}
// </div>
{/* <h2>Phase: {phase}</h2> */ }
{/* Assigned word and role  */ }
{/* Round Timer */ }
{/* <div>
        {phase === "clue" && <p>Clue phase remaining:{roundTimer} seconds</p>}
      </div> */}

//     {/* Clue Timer and input */}
//     <div>
//       {phase === "clue" && isCurrentPlayerTurn && (
//         <>
//           <p>Your clue turn remaining: {clueTimer} seconds</p>
//           <input
//             type="text"
//             value={draftMessage}
//             onChange={(e) => setDraftMessage(e.target.value)}
//             disabled={!isCurrentPlayerTurn}
//             onKeyPress={(e) => e.key === "Enter" && sendClue()}
//             placeholder="Type a clue..."
//             style={{ width: "80%", marginRight: "10px" }}
//           />
//           <button onClick={sendClue}>Send</button>
//         </>
//       )}
//     </div>

//     {/* Discussion Timer and Chat */}
//     {phase === "discussion" && (
//       <>
//         <p>Discussion phase remaining: {discussionTimer} seconds</p>
//         <input
//           type="text"
//           value={draftMessage}
//           onChange={(e) => setDraftMessage(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type a message..."
//           style={{ width: "80%", marginRight: "10px" }}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </>
//     )}

//     {/* Voting button */}
//     {/* {phase === "vote" && !hasAlreadyVoted && (
//       <div>
//         {players
//           .filter((player) => String(player.userId) !== String(userId))
//           .map((player) => (
//             <div key={player.userId}>
//               <p>{player.username}</p>
//               <button onClick={() => sendVote(player.userId)}>Vote</button>
//             </div>
//           ))}
//       </div>
//     )}
//     {phase === "vote" && hasAlreadyVoted && (
//       <p>You have voted. Please wait for voting of other players.</p>
//     )} */}

//     {/* Result */}
//     {/* {phase === "gameResult" && gameResult && (
//       <div>
//         <p>Winner role: {gameResult.winnerRole}</p>
//         <p>Winners: {gameResult.winners.map(w => `${w.username}`).join(", ")}</p>
//         <p>Losers: {gameResult.losers.map(l => `${l.username}`).join(", ")}</p>
//       </div>
//     )} */}

//     {/* Clue and Chat log */}
//     <p>Clue log</p>
//     <div id="messageList" style={{ height: "200px", overflowY: "scroll", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
//       {clueMessages.map((msg, index) => (
//         <div key={index}>{msg.username}: {msg.content}</div>
//       ))}
//     </div>
//     <p>Discussion log</p>
//     <div id="messageList" style={{ height: "200px", overflowY: "scroll", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
//       {chatMessages.map((msg, index) => (
//         <div key={index}>{msg.username}: {msg.content}</div>
//       ))}
//     </div>
//   </div>
// );

// return (
//   <div className="container">
//     {/* Left Side: Game Info and Timers */}
//     <div className="game-area">
//       <RoleWordOverlay isVisible={roleOverlay} word={word} isWolf={isWolf} />
//       <div className="panel">
//         <h1>{word}</h1>
//         <p>Round Time: {roundTimer}s</p>
//         <p>Clue Time: {clueTimer}s</p>
//       </div>
//       {voteOverlay && (
//         <VotingOverlay
//           players={players}
//           onVote={sendVote}
//           hasVoted={hasAlreadyVoted}
//           isVisible={voteOverlay}
//           results={gameResult}
//           displayResults={showResults}
//         />
//       )}
//     </div>

//     {/* Right Side: Interaction Area for Clues and Chat */}
//     <div className="interaction-area">
//       {phase === "clue" && isCurrentPlayerTurn && (
//         <div className="input-area">
//           <p>Your clue turn remaining: {clueTimer} seconds</p>
//           <textarea
//             value={draftMessage}
//             onChange={(e) => setDraftMessage(e.target.value)}
//             disabled={!isCurrentPlayerTurn}
//             placeholder="Type a clue..."
//           />
//           <button onClick={sendClue}>Send</button>
//         </div>
//       )}

//       {phase === "discussion" && (
//         <div className="input-area">
//           <p>Discussion phase remaining: {discussionTimer} seconds</p>
//           <textarea
//             value={draftMessage}
//             onChange={(e) => setDraftMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Type a message..."
//           />
//           <button onClick={sendMessage}>Send</button>
//         </div>
//       )}

//       {/* Logs for Clue and Chat */}
//       <div className="log-area">
//         <h2>Clue Log</h2>
//         {clueMessages.map((msg, index) => (
//           <div key={index}>{msg.username}: {msg.content}</div>
//         ))}
//       </div>

//       <div className="log-area">
//         <h2>Chat Log</h2>
//         {chatMessages.map((msg, index) => (
//           <div key={index}>{msg.username}: {msg.content}</div>
//         ))}
//       </div>
//     </div>
//   </div>
// ); */}
