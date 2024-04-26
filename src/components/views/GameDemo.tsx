import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { getBrokerURL } from "helpers/getBrokerURL"
import { useNavigate } from "react-router-dom";

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
          if (event.eventType === "endGame") {
            navigate("/menu");
          }
        });

        // subscribe chat
        // message has content<String>, userId<Long>, username<String>
        stompClient.subscribe(`/queue/${userId}/chat`, (message) => {
          const newChatMessage = JSON.parse(message.body);
          setChatMessages((prevChatMessages) => [...prevChatMessages, newChatMessage]);
        });

        // subscribe clue
        // message has content<String>, userId<Long>, username<String>
        stompClient.subscribe(`/queue/${userId}/clue`, (message) => {
          const newClueMessage = JSON.parse(message.body);
          setClueMessages((prevClueMessages) => [...prevClueMessages, newClueMessage]);
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
        stompClient.subscribe(`/topic/${lobbyId}/discussionTimer`, (message) => {
          const newDiscussionTime = JSON.parse(message.body);
          setDiscussionTimer(newDiscussionTime);
        });

        // subscribe clue turn
        // message has userId<Long>
        stompClient.subscribe(`/topic/${lobbyId}/clueTurn`, (message) => {
          const event = JSON.parse(message.body);
          setIsCurrentPlayerTurn(String(event.userId) === String(userId));
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
          } else {
            setIsWolf(false);
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
      if (client && connected && draftMessage) {
        const chatMessage = {
          content: draftMessage,
          userId: userId,
          lobbyId: lobbyId,
        };
        client.publish({
          destination: `/app/chat/${lobbyId}/sendMessage`,
          body: JSON.stringify(chatMessage),
        });
        setDraftMessage("");

      } else {
        console.log("STOMP connection is not established.");
      }
    };

  const sendClue = () => {
    if (client && connected && draftMessage) {
      const clueMessage = {
        content: draftMessage,
        userId: userId,
        lobbyId: lobbyId,
      };
      client.publish({
        destination: `/app/clue/${lobbyId}/sendMessage`,
        body: JSON.stringify(clueMessage),
      });
      setDraftMessage("");

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

  // const startGame = () => {
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


  return (
    <div>
      {/* This is for demo to set userId manually */}
      {/*<div>*/}
      {/*  <button onClick={startGame}>StartGame</button>*/}
      {/*</div>*/}
      {/*{!isUserIdSet && (*/}
      {/*  <>*/}
      {/*    <input*/}
      {/*      type="number"*/}
      {/*      value={userIdInput}*/}
      {/*      onChange={(e) => setUserIdInput(e.target.value)}*/}
      {/*      placeholder="Enter your userId..."*/}
      {/*    />*/}
      {/*    <button onClick={setUserIdAndHide}>Set UserId</button>*/}
      {/*  </>*/}
      {/*)}*/}
      {/*{isUserIdSet && (*/}
      {/*  <div>Your userId is {userId}</div>*/}
      {/*)}*/}
      {/*<hr/>*/}

      {/* Display phase */}
      <h2>Phase: {phase}</h2>

      {/* Assigned word and role  */}
      <div>
        {isWolf === null ? (
          <></>
        ) : isWolf ? (
          <p>You are the wolf! Try to blend in.</p>
        ) : (
          <p>This round&apos;s word is: {word}</p>
        )}
      </div>

      {/* Round Timer */}
      <div>
        {phase === "clue" && <p>Clue phase remaining:{roundTimer} seconds</p>}
      </div>

      {/* Clue Timer and input */}
      <div>
        {phase === "clue" && isCurrentPlayerTurn && (
          <>
            <p>Your clue turn remaining: {clueTimer} seconds</p>
            <input
              type="text"
              value={draftMessage}
              onChange={(e) => setDraftMessage(e.target.value)}
              disabled={!isCurrentPlayerTurn}
              onKeyPress={(e) => e.key === "Enter" && sendClue()}
              placeholder="Type a clue..."
              style={{ width: "80%", marginRight: "10px" }}
            />
            <button onClick={sendClue}>Send</button>
          </>
        )}
      </div>

      {/* Discussion Timer and Chat */}
      {phase === "discussion" && (
        <>
          <p>Discussion phase remaining: {discussionTimer} seconds</p>
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

      {/* Voting button */}
      {phase === "vote" && !hasAlreadyVoted && (
        <div>
          {players
            .filter((player) => String(player.userId) !== String(userId))
            .map((player) => (
            <div key={player.userId}>
              <p>{player.username}</p>
              <button onClick={() => sendVote(player.userId)}>Vote</button>
            </div>
          ))}
        </div>
      )}
      {phase === "vote" && hasAlreadyVoted && (
        <p>You have voted. Please wait for voting of other players.</p>
      )}

      {/* Result */}
      {phase === "gameResult" && gameResult && (
        <div>
          <p>Winner role: {gameResult.winnerRole}</p>
          <p>Winners: {gameResult.winners.map(w => `${w.username}`).join(", ")}</p>
          <p>Losers: {gameResult.losers.map(l => `${l.username}`).join(", ")}</p>
        </div>
      )}

      {/* Clue and Chat log */}
      <p>Clue log</p>
      <div id="messageList" style={{ height: "200px", overflowY: "scroll", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        {clueMessages.map((msg, index) => (
          <div key={index}>{msg.username}: {msg.content}</div>
        ))}
      </div>
      <p>Discussion log</p>
      <div id="messageList" style={{ height: "200px", overflowY: "scroll", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        {chatMessages.map((msg, index) => (
          <div key={index}>{msg.username}: {msg.content}</div>
        ))}
      </div>

    </div>
  );
};

export default GameDemo;
