// import React, { useState, useEffect } from "react";
// import { Client } from "@stomp/stompjs";
// import { getBrokerURL } from "helpers/getBrokerURL";

// const subscribeToLobbyWebSocket = (
//   //chatCallback,
//   lobbyUpdateCallback,
//   //startGameCallback,
//   playerCallback
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

//         // subscribe game events
//         // message has eventType<String>, like "startGame", "startRound".
//         // stompClient.subscribe(`/topic/${lobbyId}/gameEvents`, (message) => {
//         //   const event = JSON.parse(message.body);
//         //   const newLog = `(Event notification: ${event.eventType})`;
//         //   setGameLog((prevGameLog) => [...prevGameLog, newLog]);
//         //   startGameCallback(event);
//         // });

//         // subscribe chat
//         // message has content<String>, userId<Long>, username<String>
//         // stompClient.subscribe(`/queue/${userId}/chat`, (message) => {
//         //   const newChatMessage = JSON.parse(message.body);
//         //   setChatMessages((prevChatMessages) => [
//         //     ...prevChatMessages,
//         //     newChatMessage,
//         //   ]);
//         //   chatCallback(chatMessages);
//         // });

//         // subscribe LobbyUpdate
//         // message has content lobby(Lobby)
//         stompClient.subscribe(`/lobbies/${lobbyId}/lobby_info`, (message) => {
//           const response = JSON.parse(message.body);
//           console.log("Lobby info: ");
//           console.log(response);
//           lobbyUpdateCallback(response);
//           // setPlayers(response.data);
//           // console.log(players)
//         });

//         // ask for playerlists
//         // The return type is a list of playerDTO with their username and userId.
//         stompClient.subscribe(`/lobbies/${lobbyId}/players`, (message) => {
//           const response = JSON.parse(message.body);
//           playerCallback(response);
//           console.log('Player List: ')
//           console.log(response);
//           // setPlayers(response.data);
//           // console.log(players)
//         });
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

//   // Set the sendMessage function
//   const sendMessage = (draftMessage) => {
//     if (client && connected && draftMessage) {
//       const chatMessage = {
//         content: draftMessage,
//         userId: userId,
//         lobbyId: lobbyId,
//       };
//       client.publish({
//         destination: `/app/chat/${lobbyId}/sendMessage`,
//         body: JSON.stringify(chatMessage),
//       });
//     } else {
//       console.log(
//         "STOMP connection is not established or draftMessage is empty."
//       );
//     }
//     return sendMessage;
//   };
// };
// export { subscribeToLobbyWebSocket };
