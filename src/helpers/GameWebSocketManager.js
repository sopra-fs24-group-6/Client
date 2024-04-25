// import React, { useState, useEffect } from "react";
// import { Client } from "@stomp/stompjs";
// import { getBrokerURL } from "helpers/getBrokerURL";

// const subscribeToGameWebSocket = (
//   userId,
//   lobbyId,
//   playersCallback,
//   phaseCallback,
//   chatCallback,
//   clueCallback,
//   turnCallback,
//   roundTimerCallback,
//   clueTimerCallback,
//   discussionTimerCallback,
//   voteTimerCallback
// ) => {
//   const [client, setClient] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [chatMessages, setChatMessages] = useState([]);

//   useEffect(() => {
//     // Connect WebSocket
//     const stompClient = new Client({
//       // url is defined in helper/getBrokerURL.js
//       brokerURL: getBrokerURL(),
//       connectHeaders: { userId },
//       onConnect: () => {
//         console.log("Connected");
//         setConnected(true);
//         subscribeToChannels(stompClient);
//         const subscribeToChannels = (clientInstance) => {
//         // subscribe game events
//         // message has eventType<String>, like "startGame", "startRound".
//         stompClient.subscribe(`/topic/${lobbyId}/gameEvents`, (message) => {
//           const event = JSON.parse(message.body);
//           const newLog = `(Event notification: ${event.eventType})`;
//           setGameLog((prevGameLog) => [...prevGameLog, newLog]);
//           if (event.eventType === "startRound") {
//             phaseCallback("clue");
//           } else if (event.eventType === "startDiscussion") {
//             phaseCallback("discussion");
//           } else if (event.eventType === "startVoting") {
//             phaseCallback("vote");
//           } else if (event.eventType === "EndRound") {
//             phaseCallback("endRound");
//           }
//         });

//         // subscribe players
//         // message has content<list> of players in the game
//         stompClient.subscribe(`/topic/${lobbyId}/players`, (message) => {
//           const players = JSON.parse(message.body);
//           playersCallback(players);
//         });

//         // subscribe chat
//         // message has content<String>, userId<Long>, username<String>
//         stompClient.subscribe(`/queue/${userId}/chat`, (message) => {
//           const newChatMessage = JSON.parse(message.body);
//           setChatMessages((prevChatMessages) => [
//             ...prevChatMessages,
//             newChatMessage,
//           ]);
//           chatCallback(chatMessages);
//         });

//         // subscribe round timer
//         // message has single integer, which indicates remaining seconds
//         stompClient.subscribe(`/topic/${lobbyId}/roundTimer`, (message) => {
//           const newRoundTime = JSON.parse(message.body);
//           setRoundTimer(newRoundTime);
//           roundTimerCallback(newRoundTime);
//           roundCallback;
//         });

//         // subscribe clue timer
//         // message has single integer, which indicates remaining seconds
//         stompClient.subscribe(`/topic/${lobbyId}/clueTimer`, (message) => {
//           const newClueTime = JSON.parse(message.body);
//           setClueTimer(newClueTime);
//           clueTimerCallback(newClueTime);
//         });

//         // subscribe discussion timer
//         // message has single integer, which indicates remaining seconds
//         stompClient.subscribe(
//           `/topic/${lobbyId}/discussionTimer`,
//           (message) => {
//             const newDiscussionTime = JSON.parse(message.body);
//             setDiscussionTimer(newDiscussionTime);
//             discussionTimerCallback(newDiscussionTime);
//           }
//         );

//         // subscribe clue turn
//         // message has userId<Long>
//         stompClient.subscribe(`/topic/${lobbyId}/clueTurn`, (message) => {
//           const event = JSON.parse(message.body);
//           const newLog = `Clue phase: Player ${event.userId}'s turn.`;
//           setGameLog((prevGameLog) => [...prevGameLog, newLog]);
//           turnCallback(event.userId);
//         });

//         // subscribe result
//         // message has winnerRole<String>, winners<List<Long>>, losers<List<Long>>
//         stompClient.subscribe(`/topic/${lobbyId}/result`, (message) => {
//           const event = JSON.parse(message.body);
//           const newLog = `Winner role: ${event.winnerRole}. Winner players: ${event.winners}. Loser players: ${event.losers}`;
//           setGameLog((prevGameLog) => [...prevGameLog, newLog]);
//         });

//         // subscribe word assignment
//         // message has word<String>. if null, it indicates Wolf.
//         stompClient.subscribe(`/queue/${userId}/wordAssignment`, (message) => {
//           const event = JSON.parse(message.body);
//           const newLog = event.word
//             ? `Your assigned word is: ${event.word}`
//             : "You're wolf.";
//           setGameLog((prevGameLog) => [...prevGameLog, newLog]);
//           clueCallback(event.word);
//         });
//         subscriptions.current.push(gameEventsSub, lobbyInfoSub, playerInfoSub);
//     }
//         // Set the sendMessage function
//         const sendMessage = (draftMessage) => {
//           if (client && connected && draftMessage) {
//             const chatMessage = {
//               content: draftMessage,
//               userId: userId,
//               lobbyId: lobbyId,
//             };
//             client.publish({
//               destination: `/app/chat/${lobbyId}/sendMessage`,
//               body: JSON.stringify(chatMessage),
//             });
//           } else {
//             console.log(
//               "STOMP connection is not established or draftMessage is empty."
//             );
//           }
//           return sendMessage;
//         };
//       },
//       onStompError: (frame) => {
//         console.error("Broker reported error: " + frame.headers["message"]);
//         console.error("Additional details: " + frame.body);
//         setConnected(false);
//       },
//     });
//     stompClient.activate();
//     setClient(stompClient);

//     // if close window or move to another page, then disconnect
//     const handleBeforeUnload = () => {
//       stompClient.deactivate();
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       stompClient.deactivate();
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [userId]);
// };
// export { subscribeToGameWebSocket };
// new socket try
//
import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { getBrokerURL } from "helpers/getBrokerURL";

export const useGameWebSocket = (
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
) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const subscriptions = useRef([]);

  useEffect(() => {
    if (!lobbyId) return;

    const stompClient = new Client({
      brokerURL: getBrokerURL(),
      connectHeaders: {
        userId,
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        setConnected(true);
        subscribeToChannels(stompClient);
      },
      onStompError: (frame) => {
        console.error("Broker reported error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
        setConnected(false);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      console.log("Deactivating WebSocket client");
      subscriptions.current.forEach((sub) => sub.unsubscribe());
      subscriptions.current = [];
      stompClient.deactivate();
      setConnected(false);
      setClient(null);
    };
  }, [userId, lobbyId]);

  const subscribeToChannels = (clientInstance) => {

    const gameEventsSub = clientInstance.subscribe(
      `/topic/${lobbyId}/gameEvents`,
      (message) => {
        try {
          const event = JSON.parse(message.body);
          console.log(`Received game event: ${event.eventType}`, event);
          if (event.eventType === "startRound") {
            phaseCallback("clue");
          } else if (event.eventType === "startDiscussion") {
            phaseCallback("discussion");
          } else if (event.eventType === "startVoting") {
            phaseCallback("vote");
          } else if (event.eventType === "EndRound") {
            phaseCallback("endRound");
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    );
    const playersSub = clientInstance.subscribe(
      `/topic/${lobbyId}/players`,
      (message) => {
        const players = JSON.parse(message.body);
        playersCallback(players);
      }
    );
    //const chatSub = clientInstance.subscribe(`/queue/${userId}/chat`, /* ... */);
    const roundTimerSub = clientInstance.subscribe(
      `/topic/${lobbyId}/roundTimer`,
      (message) => {
        const newRoundTime = JSON.parse(message.body);
        setRoundTimer(newRoundTime);
        roundTimerCallback(newRoundTime);
        roundCallback;
      }
    );
    const clueTimerSub = clientInstance.subscribe(
      `/topic/${lobbyId}/clueTimer`,
      (message) => {
        const newClueTime = JSON.parse(message.body);
        setClueTimer(newClueTime);
        clueTimerCallback(newClueTime);
      }
    );
    const discussionTimerSub = clientInstance.subscribe(
      `/topic/${lobbyId}/discussionTimer`,
      (message) => {
        const newDiscussionTime = JSON.parse(message.body);
        setDiscussionTimer(newDiscussionTime);
        discussionTimerCallback(newDiscussionTime);
      }
    );
    const turnSub = clientInstance.subscribe(`/topic/${lobbyId}/clueTurn`, (message) => {
        const event = JSON.parse(message.body);
        const newLog = `Clue phase: Player ${event.userId}'s turn.`;
        setGameLog((prevGameLog) => [...prevGameLog, newLog]);
        turnCallback(event.userId);
      }
    );
    // const voteTimerSub = clientInstance.subscribe(
    //   `/topic/${lobbyId}/players`)

    const resultSub = clientInstance.subscribe(
      `/topic/${lobbyId}/result`, (message) => {
        const event = JSON.parse(message.body);
        const newLog = `Winner role: ${event.winnerRole}. Winner players: ${event.winners}. Loser players: ${event.losers}`;
        setGameLog((prevGameLog) => [...prevGameLog, newLog]);
      }
    );

    const wordSub = clientInstance.subscribe(
      `/queue/${userId}/wordAssignment`, (message) => {
        const event = JSON.parse(message.body);
        // const newLog = event.word
        // ? `Your assigned word is: ${event.word}`
        // : "You're wolf.";
        //setGameLog((prevGameLog) => [...prevGameLog, newLog]);
        wordCallback(event.word);
        console.log("Is this being called", event);
      }
    );

    subscriptions.current.push(
      gameEventsSub,
      playersSub,
      roundTimerSub,
      clueTimerSub,
      discussionTimerSub,
      turnSub,
      //voteTimerSub,
      resultSub,
      wordSub
    );
  };

  // Other code for sending messages...
  const sendMessage = (destination, message) => {
    if (client && connected) {
      client.publish({ destination, body: JSON.stringify(message) });
    } else {
      console.log(
        "Cannot send message, client not connected or not available."
      );
    }
  };

  return {
    sendMessage,
    connected,
    chatMessages: subscriptions.current.chatMessages,
  };
};

export default useGameWebSocket;
