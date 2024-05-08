import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { getBrokerURL } from "helpers/getBrokerURL";

export const useLobbyWebSocket = (
  isAdmin,
  lobbyId,
  startGameCallback,
  lobbyCallback,
  playerCallback,
  userId,
) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const subscriptions = useRef([]);

  useEffect(() => {
    if (!lobbyId || client) return;

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
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        setConnected(false);
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
      setClient(null);
      setConnected(false);
    };
  }, [lobbyId, userId]);

  const subscribeToChannels = (clientInstance) => {
    console.log(`Subscribing to channels for lobbyId: ${lobbyId}`);

    const gameEventsSub = clientInstance.subscribe(
      `/topic/${lobbyId}/gameEvents`,
      (message) => {
        try {
          const event = JSON.parse(message.body);
          console.log(`Received game event: ${event.eventType}`, event);
          if (event.eventType === "startGame") {
            console.log(`Received game event: ${event.eventType}`, event);
            startGameCallback();
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    );

    if(!isAdmin){
    const lobbyInfoSub = clientInstance.subscribe(
      `/lobbies/${lobbyId}/lobby_info`,
      (message) => {
        const response = JSON.parse(message.body);
        console.log("Received lobby info:", response);
        lobbyCallback(response);
      }
    );}

    const playerInfoSub = clientInstance.subscribe(
      `/lobbies/${lobbyId}/players`,
      (message) => {
        const response = JSON.parse(message.body);
        console.log("Received player info:", response);
        playerCallback(response);
      }
    );

    // Push subscriptions to ref array for cleanup
    if(!isAdmin){
    subscriptions.current.push(gameEventsSub, lobbyInfoSub, playerInfoSub);
  }else {subscriptions.current.push(gameEventsSub, playerInfoSub);}
  };

  const sendMessage = (destination, message) => {
    if (client && connected) {
      console.log(`Sending message to ${destination}:`, message);
      client.publish({ destination, body: JSON.stringify(message) });
    } else {
      console.log("Cannot send message, client not connected or not available.");
    }
  };

  return { sendMessage, connected, client };
};