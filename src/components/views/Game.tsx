import React, { useEffect, useState, useCallback } from "react";
//import { subscribeToGameWebSocket } from "../../helpers/GameWebSocketManager.js";
import { useGameWebSocket } from "helpers/GameWebSocketManager";
import { User } from "types";
import { api, handleError } from "helpers/api";
import ClueOverlay from "../ui/ClueOverlay";
//import Timer from "../ui/Timer";

const Game = () => {
  const [phase, setPhase] = useState<string>("");
  const [word, setWord] = useState(""); //needed with every rounstart hook
  const [isWolf, setIsWolf] = useState(false);
  const [round, setRound] = useState(1); // needed with every roundstart hook
  const [isCurrentPlayerTurn, setIsCurrentPlayerTurn] = useState(false);
  const [chat, setChat] = useState([]);
  const [roundTimer, setRoundTimer] = useState(null);
  const [clueTimer, setClueTimer] = useState(null);
  const [discussionTimer, setDiscussionTimer] = useState(null);
  const [voteTimer, setVoteTimer] = useState(null);
  const [clue, setClue] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [players, setPlayers] = useState([]);
  //const [sendMessage, setSendMessage] = useState(null);
  const player = localStorage.getItem("userId");
  const lobbyId = localStorage.getItem("lobbyId");
  const userId = localStorage.getItem("userId");

  const playersCallback = useCallback((players) => {
    console.log("playerCallback", players);
    setPlayers(players);
  }, [])

  const phaseCallback = useCallback((phase) => {
    console.log("phaseCallback", phase);
    setPhase(phase);
  }, [])

  const wordCallback = useCallback((word) => {
    console.log("WordCallback", word);
    if(!word) {
        setIsWolf(true);
        setWord("");
    } else {
    setWord(word);
    setIsWolf(false);
}
  }, []);

  const turnCallback = useCallback((turn) => {
    console.log("turnCallback", turn);
    setIsCurrentPlayerTurn(turn === player);
  }, []);

  const roundTimerCallback = useCallback((roundTimer) => {
    console.log("roundTimer", roundTimer);
    setRoundTimer(roundTimer);
  }, []);

  const clueTimerCallback = useCallback((clueTimer) => {
    console.log("clueTimer", clueTimer);
    setClueTimer(clueTimer);
  }, []);

  const discussionTimerCallback = useCallback((timer) => {
    console.log("discussionTimer", timer);
    setDiscussionTimer(timer)
  }, []);

  // const roleAssignedCallback = useCallback(() => {
  //   ()
  // }, []);

  const {
    sendMessage,
    connected,
    chatMessages
  } = useGameWebSocket(
    userId,
    lobbyId,
    playersCallback,
    phaseCallback,
    //chatCallback,
    wordCallback,
    turnCallback,
    roundTimerCallback,
    clueTimerCallback,
    discussionTimerCallback,
    //voteTimerCallback
    //roleAssignedCallback,
  );

  return (
    <div>
      {/* <h2>Phase: {phase}</h2>
      {phase === "clue" && (
        <ClueOverlay isWolf={isWolf(player)} word={word} round={round} />
      )} */}
      <div>
        {isWolf ? (
          <p>You are the wolf! Try to blend in.</p>
        ) : (
          <p>This round&apos;s word is: {word}</p>
        )}
      </div>
      <div>
        {phase === "clue" && <p>Time remaining:{roundTimer} seconds</p>}
      </div>
      <div>
        {phase === "clue" && isCurrentPlayerTurn && (
          <>
            <p>Time remaining: {clueTimer} seconds</p>
            {/* <input
              type="text"
              placeholder="Enter your clue"
              onChange={(e) => sendMessage(e.target.value)}
            /> */}
          </>
        )}
      </div>
      <div
        id="messageList"
        style={{
          height: "200px",
          overflowY: "scroll",
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {chat.map((msg, index) => (
          <div key={index}>
            {msg.userId}: {msg.content}
          </div>
        ))}
      </div>
      {phase === "clue" && (
        <>
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            disabled={!isCurrentPlayerTurn}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a clue..."
            style={{ width: "80%", marginRight: "10px" }}
          />
          <button onClick={sendMessage} disabled={!isCurrentPlayerTurn}>
            Send
          </button>
        </>
      )}
      {phase === "discussion" && (
        <>
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{ width: "80%", marginRight: "10px" }}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}

      {/* {phase === "vote" && (
        <div>
          {players.map((player) => (
            <div key={player.id}>
              <p>{player.name}</p>
              <button onClick={() => handleVote(player.id)}>Vote</button>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};
export default Game;
