import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { getBrokerURL } from "helpers/getBrokerURL"

const GameDemo = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [roundTimer, setRoundTimer] = useState(0);
  const [clueTimer, setClueTimer] = useState(0);
  const [discussionTimer, setDiscussionTimer] = useState(0);

  // these settings are for demo. userId and lobbyId should be set appropriately.
  const [gameLog, setGameLog] = useState([])
  const [userId, setUserId] = useState("");
  const [userIdInput, setUserIdInput] = useState("");
  const [isUserIdSet, setIsUserIdSet] = useState(false);
  const lobbyId = "1";


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
    setUserId(localStorage.getItem('userId'))
    const stompClient = new Client({
      // url is defined in helper/getBrokerURL.js
      brokerURL: getBrokerURL(),
      connectHeaders: { userId },
      onConnect: () => {
        console.log("Connected");
        setConnected(true);

        // subscribe game events
        // message has eventType<String>, like "startGame", "startRound".
        stompClient.subscribe(`/topic/${lobbyId}/gameEvents`, (message) => {
          const event = JSON.parse(message.body);
          const newLog = `(Event notification: ${event.eventType})`;
          setGameLog((prevGameLog) => [...prevGameLog, newLog]);
        });

        // subscribe chat
        // message has content<String>, userId<Long>, username<String>
        stompClient.subscribe(`/queue/${userId}/chat`, (message) => {
          const newChatMessage = JSON.parse(message.body);
          setChatMessages((prevChatMessages) => [...prevChatMessages, newChatMessage]);
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
          const newLog = `Clue phase: Player ${event.userId}'s turn.`;
          setGameLog((prevGameLog) => [...prevGameLog, newLog]);
        });

        // subscribe result
        // message has winnerRole<String>, winners<List<Long>>, losers<List<Long>>
        stompClient.subscribe(`/topic/${lobbyId}/result`, (message) => {
          const event = JSON.parse(message.body);
          const newLog = `Winner role: ${event.winnerRole}. Winner players: ${event.winners}. Loser players: ${event.losers}`;
          setGameLog((prevGameLog) => [...prevGameLog, newLog]);
        });

        // subscribe word assignment
        // message has word<String>. if null, it indicates Wolf.
        stompClient.subscribe(`/queue/${userId}/wordAssignment`, (message) => {
          console.log('Hi')
          const event = JSON.parse(message.body);
          // const newLog = event.word ? `Your assigned word is: ${event.word}` : "You're wolf.";
          const newLog = event.word;
          setGameLog((prevGameLog) => [...prevGameLog, newLog]);
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

  const clearMessages = () => {
    setChatMessages([]);
  };

  const startGame = () => {
    if (client && connected) {
      client.publish({
        destination: "/app/startGame",
        body: JSON.stringify({ lobbyId, userId }),
      });
    } else {
      console.log("STOMP connection is not established.");
    }
  }

  const clearGameLog = () => {
    setGameLog([]);
  };

  // this function is for demo and should be deleted.
  const setUserIdAndHide = () => {
    setUserId(userIdInput);
    setIsUserIdSet(true);
  };


  return (
    <div>
      <h2>Game Demo</h2>

      {/* This is for demo to set userId manually */}
      {/* {!isUserIdSet && (
        <>
          <input
            type="number"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            placeholder="Enter your userId..."
          />
          <button onClick={setUserIdAndHide}>Set UserId</button>
        </>
      )}
      {isUserIdSet && (
        <div>Your userId is {userId}</div>
      )} */}
      <div>Your userId is {userId}</div>

      {/* Game log */}
      <div>
        <button onClick={startGame}>StartGame</button>
        <button onClick={clearGameLog}>Clear Log</button>
      </div>
      <div>roundTimer: {roundTimer} seconds</div>
      <div>clueTimer: {clueTimer} seconds</div>
      <div>discussionTimer: {discussionTimer} seconds</div>
      <div>
        <h2>Log</h2>
        <ul>
          {gameLog.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* Chat */}
      <div id="messageList" style={{ height: "200px", overflowY: "scroll", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        {chatMessages.map((msg, index) => (
          <div key={index}>{msg.userId}: {msg.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={draftMessage}
        onChange={(e) => setDraftMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ width: "80%", marginRight: "10px" }}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={clearMessages}>Clear Chat</button>

    </div>
  );
};

export default GameDemo;
