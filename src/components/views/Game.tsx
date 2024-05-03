import React, { useEffect, useState, useCallback } from "react";
//import { subscribeToGameWebSocket } from "../../helpers/GameWebSocketManager.js";
import { useParams } from "react-router-dom";
import { useGameWebSocket } from "helpers/GameWebSocketManager";
import { useNavigate } from "react-router-dom";
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
  const [roundTimer, setRoundTimer] = useState<number | null>(null);
  const [clueTimer, setClueTimer] = useState(null);
  const [discussionTimer, setDiscussionTimer] = useState(null);
  const [voteTimer, setVoteTimer] = useState(null);
  const [clue, setClue] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [players, setPlayers] = useState([]);
<<<<<<< HEAD
  const [hasVoted, setHasVoted] = useState(false);
  const [gameResult, setGameResult] = useState(null);
=======
  const navigate = useNavigate();
>>>>>>> 1b9185998f7fecc1cb20bcb8136d5812a4ec67dc
  //const [sendMessage, setSendMessage] = useState(null);
  const lobbyId = localStorage.getItem("lobbyId");

  const userId = localStorage.getItem("userId");

  const { lobbyId: urlLobbyId } = useParams();
  //console.log("lobby id", urlLobbyId);

  const playersCallback = useCallback((players) => {
    console.log("playerCallback", players);
    setPlayers(players);
  }, []);

  useEffect (()=> {
    console.log(gameResult);
  }, [gameResult]);

  const phaseCallback = useCallback((phase) => {
    console.log("phaseCallback", phase);
<<<<<<< HEAD
    if (phase === "clue") {
      setPhase("Clue");
    } else if (phase === "discussion") {
      setPhase("Discussion");
    } else if (phase === "vote") {
      setPhase("Voting");
    } else if (phase === "gameResult") {
      setPhase("Results");
    } else if (phase === "endGame") {
      setPhase("End");
    }
  }, [])

  const chatCallback = useCallback((chat) => {
    setChat(chat);
  }, [])
=======
    setPhase(phase);
  }, []);

  const endGameCallback = useCallback(() => {
    console.log("endGameCallback", phase);
    navigate("/menu");
  }, []);
>>>>>>> 1b9185998f7fecc1cb20bcb8136d5812a4ec67dc

  const wordCallback = useCallback((word) => {
    console.log("WordCallback", word);
    if (!word) {
      setIsWolf(true);
      setWord("");
    } else {
      setWord(word);
      setIsWolf(false);
    }
<<<<<<< HEAD
  }, [round]);
=======
  }, []);
>>>>>>> 1b9185998f7fecc1cb20bcb8136d5812a4ec67dc

  const turnCallback = useCallback((turn) => {
    setIsCurrentPlayerTurn(parseInt(turn) === parseInt(userId))
    console.log("turnCallback", turn, userId);
    console.log("bool", isCurrentPlayerTurn);
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
    setDiscussionTimer(timer);
  }, []);

  const resultCallback = useCallback((result) => {
    setGameResult(result);
  }, []);

  // const roleAssignedCallback = useCallback(() => {
  //   ()
  // }, []);

<<<<<<< HEAD
  const {
    sendMessage,
    sendVote,
    connected,
    chatMessages
  } = useGameWebSocket(
=======
  const { sendMessage, connected, chatMessages } = useGameWebSocket(
>>>>>>> 1b9185998f7fecc1cb20bcb8136d5812a4ec67dc
    userId,
    urlLobbyId,
    playersCallback,
    phaseCallback,
<<<<<<< HEAD
    chatCallback,
=======
    endGameCallback,
    //chatCallback,
>>>>>>> 1b9185998f7fecc1cb20bcb8136d5812a4ec67dc
    wordCallback,
    turnCallback,
    roundTimerCallback,
    clueTimerCallback,
<<<<<<< HEAD
    discussionTimerCallback,
    resultCallback,
=======
    discussionTimerCallback
>>>>>>> 1b9185998f7fecc1cb20bcb8136d5812a4ec67dc
    //voteTimerCallback
    //roleAssignedCallback,
  );

  return (
    <div>
      <h1>{phase}</h1>
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
        {phase === "Clue" && (
          <p>Phase: {phase} - Time remaining: {roundTimer} seconds</p>
        )}
      </div>
      <div
        //clue display
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
          <div key={index}>  {/* If msg has a unique id, use key={msg.id} */}
            {msg.userId}: {msg.content}
          </div>
        ))}
      </div>
      {phase === "Clue" && (
        <>{isCurrentPlayerTurn &&
          <p>Time remaining: {clueTimer} seconds</p>
        }
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            disabled={!isCurrentPlayerTurn}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a clue..."
            style={{ width: "80%", marginRight: "10px" }}
          />
          <button onClick={sendMessage(`/app/clue/${urlLobbyId}/sendMessage`, draftMessage, userId, urlLobbyId,)} disabled={!isCurrentPlayerTurn}>
            Send
          </button>
        </>
      )}
      {phase === "Discussion" && (
        <>
          <p>Phase: {phase} - Time remaining: {discussionTimer} seconds</p>
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{ width: "80%", marginRight: "10px" }}
          />
          <button onClick={sendMessage(`/app/chat/${urlLobbyId}/sendMessage`, draftMessage, userId, urlLobbyId,)}>Send</button>
        </>
      )}

      {phase === "Voting" && !hasVoted && (
        <div>
          {players.map((player) => (
            <div key={player.userId}>
              <p>{player.username}</p>
              <button onClick={() => { sendVote(player.userId, userId); setDraftMessage(""); setHasVoted(true); }}>Vote</button>
            </div>
          ))}
        </div>
      )}
      {phase === "Voting" && hasVoted && (
        <h2>waiting for other players to vote</h2>
      )}
      {phase === "Results" && gameResult && (
        <div>
          <p>Winner role: {gameResult.winnerRole}</p>
          <p>Winners: {gameResult.winners.map(w => `${w.username}`).join(", ")}</p>
          <p>Losers: {gameResult.losers.map(l => `${l.username}`).join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default Game;
