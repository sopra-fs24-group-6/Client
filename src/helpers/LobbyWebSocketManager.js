import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { getBrokerURL } from "helpers/getBrokerURL";

export const useLobbyWebSocket = (lobbyId, startGameCallback, lobbyCallback, playerCallback) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [subscribed, setSubscribed] = useState(false); // New state variable

  useEffect(() => {
    if (!lobbyId || subscribed) return;

    const stompClient = new Client({
        brokerURL: getBrokerURL(),
        onConnect: () => {
            console.log("Connected to WebSocket");
            setConnected(true);
            subscribeToChannels(client);
        },
        onStompError: (frame) => {
            console.error("Broker reported error:", frame.headers["message"]);
            console.error("Additional details:", frame.body);
            setConnected(false);
        },
    });

    const subscribeToChannels = (client) => {
      // subscribe game events
      // message has eventType<String>, like "startGame", "startRound".
        client.subscribe(`/topic/${lobbyId}/gameEvents`, (message) => {
          const event = JSON.parse(message.body);
          const newLog = `(Event notification: ${event.eventType})`;
          setGameLog((prevGameLog) => [...prevGameLog, newLog]);
          if(event.eventType==="startGame") {
            startGameCallback();
          }
        });
        client.subscribe(`/lobbies/${lobbyId}/lobby_info`, (message) => {
            const response = JSON.parse(message.body);
            console.log(response);
            lobbyCallback(response);
        });
        client.subscribe(`/lobbies/${lobbyId}/players`, (message) => {
            const response = JSON.parse(message.body);
            console.log(response);
            playerCallback(response);
        });
    };

    stompClient.activate();
    setClient(stompClient);
    setSubscribed(true);

    // Add console.log to verify lobbyCallback invocation
    console.log("Calling lobbyCallback...");

    return () => {
        stompClient.deactivate();
    };
}, [lobbyId, lobbyCallback, playerCallback]); // Include subscribed in the dependencies array

  // Send a message to a specified destination
  const sendMessage = (destination, message) => {
    if (client && connected) {
      client.publish({ destination, body: JSON.stringify(message) });
    }
  };

  return { sendMessage, connected };
};
