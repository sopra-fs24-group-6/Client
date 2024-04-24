import React, { useState, useEffect } from "react";
export const useLobbyWebSocket = (lobbyId, lobbyCallback, playerCallback) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!lobbyId) return;

    const stompClient = new Client({
      brokerURL: getBrokerURL(),
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

    const subscribeToChannels = (client) => {
      client.subscribe(`/lobbies/${lobbyId}/lobby_info`, (message) => {
        const response = JSON.parse(message.body);
        lobbyCallback(response);
      });
      client.subscribe(`/lobbies/${lobbyId}/players`, (message) => {
        const response = JSON.parse(message.body);
        playerCallback(response);
      });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [lobbyId, lobbyCallback, playerCallback]);

  // Send a message to a specified destination
  const sendMessage = (destination, message) => {
    if (client && connected) {
      client.publish({ destination, body: JSON.stringify(message) });
    }
  };

  return { sendMessage, connected };
};
