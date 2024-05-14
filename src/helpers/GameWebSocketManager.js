import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { getBrokerURL } from "helpers/getBrokerURL";

export const useGameWebSocket = (
  userId,
  lobbyId,
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
) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [prevChat, setPrevChat] = useState(null);
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
<<<<<<< HEAD
    console.log(`Subscribing to /topic/${lobbyId}/gameEvents`);
=======
>>>>>>> 1b9185998f7fecc1cb20bcb8136d5812a4ec67dc
    const gameEventsSub = clientInstance.subscribe(
      `/topic/${lobbyId}/gameEvents`,
      (message) => {
        try {
          const event = JSON.parse(message.body);
          console.log(`Received game event: ${event.eventType}`, event);
<<<<<<< HEAD
          //if (event.eventType === "startRound") {
          //phaseCallback("clue");
          phaseCallback(event.eventType);
          //} else if (event.eventType === "startDiscussion") {
          //phaseCallback("discussion");
          // } else if (event.eventType === "startVoting") {
          //   phaseCallback("vote");
          // } else if (event.eventType === "EndRound") {
          //   phaseCallback("endRound");
          // }
=======
          if (event.eventType === "startRound") {
            phaseCallback("clue");
          } else if (event.eventType === "startDiscussion") {
            phaseCallback("discussion");
          } else if (event.eventType === "startVoting") {
            phaseCallback("vote");
          } else if (event.eventType === "EndRound") {
            phaseCallback("endRound");
          } else if (event.eventType === "EndGame") {
            endGameCallback;
          }
>>>>>>> 1b9185998f7fecc1cb20bcb8136d5812a4ec67dc
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    );
    //console.log(`Subscribed to /topic/${lobbyId}/gameEvents`);
    const playersSub = clientInstance.subscribe(
      `/topic/${lobbyId}/players`,
      (message) => {
        console.log("check1", message)
        const players = JSON.parse(message.body);
        playersCallback(players);
      }
    );
    const chatSub = clientInstance.subscribe(
      `/queue/${userId}/chat`,
      (message) => {
        const newChatMessage = JSON.parse(message.body);
        setPrevChat(prevChat => [...prevChat, newChatMessage])
        chatCallback(prevChat);
      }
    );
    const roundTimerSub = clientInstance.subscribe(
      `/topic/${lobbyId}/roundTimer`,
      (message) => {
        //console.log("check2", message)
        const newRoundTime = JSON.parse(message.body);
        roundTimerCallback(newRoundTime);
      }
    );
    const clueTimerSub = clientInstance.subscribe(
      `/topic/${lobbyId}/clueTimer`,
      (message) => {
        //console.log("check3", message)
        const newClueTime = JSON.parse(message.body);
        clueTimerCallback(newClueTime);
      }
    );
    const discussionTimerSub = clientInstance.subscribe(
      `/topic/${lobbyId}/discussionTimer`,
      (message) => {
        //console.log("check4", message)
        const newDiscussionTime = JSON.parse(message.body);
        discussionTimerCallback(newDiscussionTime);
      }
    );
    const turnSub = clientInstance.subscribe(
      `/topic/${lobbyId}/clueTurn`,
      (message) => {
<<<<<<< HEAD
        //console.log("check5", message)
=======
>>>>>>> 1b9185998f7fecc1cb20bcb8136d5812a4ec67dc
        const event = JSON.parse(message.body);
        //const newLog = `Clue phase: Player ${event.userId}'s turn.`;
        turnCallback(event.userId);
      }
    );
    // const voteTimerSub = clientInstance.subscribe(
    //   `/topic/${lobbyId}/players`)

    const resultSub = clientInstance.subscribe(
      `/topic/${lobbyId}/result`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log(event.winnerRole, event.winners, event.losers);
        // resultCallback(event.winnerRole, event.winners, event.losers);
        resultCallback(event);
      }
    );

    const wordSub = clientInstance.subscribe(
      `/queue/${userId}/wordAssignment`,
      (message) => {
        const event = JSON.parse(message.body);
        // const newLog = event.word
        // ? `Your assigned word is: ${event.word}`
        // : "You're wolf.";
        //setGameLog((prevGameLog) => [...prevGameLog, newLog]);
        wordCallback(event.word);
        //console.log("Is this being called", event);
      }
    );

    subscriptions.current.push(
      gameEventsSub,
      chatSub,
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

  const sendMessage = (destination, draftMessage, userId, lobbyId) => {
    if (client && connected) {
      const chatMessage = {
        content: draftMessage,
        userId: userId,
        lobbyId: lobbyId,
      };
      client.publish({ destination: destination, body: JSON.stringify(chatMessage)});
    } else {
      console.log(
        "Cannot send message, client not connected or not available."
      );
    }
  };

  const sendVote = (votedUserId, userId) => {
    if (client && connected) {
      const voteMessage = {
        voterUserId: userId,
        votedUserId: votedUserId,
      };
      console.log(userId)
      console.log(votedUserId)

      client.publish({
        destination: `/app/vote/${lobbyId}/sendVote`,
        body: JSON.stringify(voteMessage),
      });
      // setDraftMessage("");
      // setHasAlreadyVoted(true);
    } else {
      console.log("STOMP connection is not established.");
    }
  };

  return {
    sendMessage,
    sendVote,
    connected,
    chatMessages: subscriptions.current.chatMessages,
  };
};

export default useGameWebSocket;
