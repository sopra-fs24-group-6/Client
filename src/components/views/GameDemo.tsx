import React, { useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import { Client } from "@stomp/stompjs";
import { getBrokerURL } from "helpers/getBrokerURL";
import { useNavigate } from "react-router-dom";
import { getDomain } from "helpers/getDomain";
import RoleWordOverlay from "components/ui/RoleWordOverlay";
import "../../styles/ui/GameDemo.scss";
import VotingOverlay from "components/ui/VotingOverlay";
import InfoBar from "components/ui/InfoBar";
import NESContainer from "components/ui/NESContainer";
import TimerDisplay from "components/ui/TimerDisplay";
import CustomButton from "components/ui/CustomButton";
import background3 from "../../assets/Backgrounds/grass.png";
import leaderList from "components/placeholders/leaderlist";

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
  const [players, setPlayers] = useState(leaderList);
  const [hasAlreadyVoted, setHasAlreadyVoted] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const lobbyId = localStorage.getItem("lobbyId");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(null);
  const [maxRound, setMaxRound] = useState(null);

  const chatLogRef = useRef(null);
  const clueLogRef = useRef(null);
  const [role, setRole] = useState("");

  const [roleOverlay, setRoleOverlay] = useState<boolean>(true);
  const [voteOverlay, setVoteOverlay] = useState<boolean>(false);
  const [showResults, setShowResults] = useState(false);
  const [draftChatMessage, setDraftChatMessage] = useState("");
  const [draftClueMessage, setDraftClueMessage] = useState("");
  const [playerTurn, setPlayerTurn] = useState("");
  const [startPlayers, setStartPlayers] = useState([]);
  const [hasSentClue, setHasSentClue] = useState(false);

  const [userIds, setUserIds] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [timestamp] = useState(new Date().getTime());

  useEffect(() => {
    const playerGetter = async () => {
      const id = localStorage.getItem("lobbyId");
      try {
        const response = await api.get(`/lobbies/${id}/players`);
        setStartPlayers(response.data);
        // Log each player's avatarUrl
        response.data.forEach(player => {
          console.log(`Player ${player.userId} avatarUrl:`, getDomain() + "/" + player.avatarUrl + `?v=${timestamp}`);
        });

        const fetchedUserIds = response.data.map((player) => player.userId);
        setUserIds(fetchedUserIds);
      } catch (error) {
        alert(`Couldn't fetch players in the lobby: \n${handleError(error)}`);
      }
    };

    playerGetter();
  }, []);

  useEffect(() => {
    let overlayTimer;
    if (roleOverlay) {
      overlayTimer = setTimeout(() => {
        setRoleOverlay(false);
      }, 8000);
    }

    return () => clearTimeout(overlayTimer);
  }, [roleOverlay]);

  useEffect(() => {
    if (phase === "vote") {
      setVoteOverlay(true);
    } else if (phase === "roundResult") {
      setVoteOverlay(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "roundResult") {
      setVoteOverlay(true);
      setShowResults(true);
    }
  }, [phase, gameResult]);

  const scrollClue = () => {
    if (clueLogRef.current) {
      clueLogRef.current.scrollTop = clueLogRef.current.scrollHeight;
    }
  };

  const scrollChat = () => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollChat();
  }, [chatMessages]);

  useEffect(() => {
    scrollClue();
  }, [clueMessages]);

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
          if (event.eventType === "startRound") {
            setHasAlreadyVoted(false);
            setCurrentRound(event.currentRound);
            setMaxRound(event.maxRound);
            setShowResults(false);
            setVoteOverlay(false);
            setRoleOverlay(true);
          }
          // if (event.eventType === "vote") {
          //   setVoteOverlay(true);
          // }
          if (event.eventType === "endGame") {
            //setVoteOverlay(false);
            navigate("/menu");
          }
        });

        // subscribe chat
        // message has content<String>, userId<Long>, username<String>
        stompClient.subscribe(`/queue/${userId}/chat`, (message) => {
          const newChatMessage = JSON.parse(message.body);
          setChatMessages((prevChatMessages) => [
            ...prevChatMessages,
            newChatMessage,
          ]);
        });

        // subscribe clue
        // message has content<String>, userId<Long>, username<String>
        stompClient.subscribe(`/queue/${userId}/clue`, (message) => {
          const newClueMessage = JSON.parse(message.body);
          setClueMessages((prevClueMessages) => [
            ...prevClueMessages,
            newClueMessage,
          ]);
        });

        // subscribe round timer
        // message has single integer, which indicates remaining seconds
        stompClient.subscribe(`/topic/${lobbyId}/roundTimer`, (message) => {
          const newRoundTime = JSON.parse(message.body);
          if (newRoundTime === 0) {
            setPlayerTurn("");
          };
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
        stompClient.subscribe(
          `/topic/${lobbyId}/discussionTimer`,
          (message) => {
            const newDiscussionTime = JSON.parse(message.body);
            setDiscussionTimer(newDiscussionTime);
          }
        );

        // subscribe clue turn
        // message has userId<Long>
        stompClient.subscribe(`/topic/${lobbyId}/clueTurn`, (message) => {
          const event = JSON.parse(message.body);
          setPlayerTurn(event.userId);
          setIsCurrentPlayerTurn(String(event.userId) === String(userId));

          const turnUserId = JSON.parse(message.body).userId;
          setPlayers((currentPlayers) =>
            currentPlayers.map((player) => ({
              ...player,
              isTurn: player.userId === turnUserId,
            }))
          );
          if (String(event.userId) === String(userId)) {
            setHasSentClue(false);
          }
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
          if (event.isWolf) {
            setIsWolf(true);
            setRole("Wolf");
          } else {
            setIsWolf(false);
            setRole("Villager");
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
    if (client && connected && draftChatMessage) {
      const chatMessage = {
        content: draftChatMessage,
        userId: userId,
        lobbyId: lobbyId,
      };
      client.publish({
        destination: `/app/chat/${lobbyId}/sendMessage`,
        body: JSON.stringify(chatMessage),
      });
      setDraftChatMessage("");
    } else {
      console.log("STOMP connection is not established.");
    }
  };

  const sendClue = () => {
    if (client && connected) {
      if (draftClueMessage && role === "Villager" && !hasSentClue) {
        const normalizedDraftMessage = draftClueMessage.toLowerCase().trim();
        if (
          !normalizedDraftMessage ||
          normalizedDraftMessage === word.toLowerCase().trim()
        ) {
          alert(
            "Clue cannot be submitted: It is equal or too similar to the word."
          );

          return;
        }
      }
      const clueMessage = {
        content: draftClueMessage,
        userId: userId,
        lobbyId: lobbyId,
      };
      client.publish({
        destination: `/app/clue/${lobbyId}/sendMessage`,
        body: JSON.stringify(clueMessage),
      });
      setDraftClueMessage("");
      setHasSentClue(true);
    } else {
      console.error(
        "STOMP connection is not established or draft clue is empty."
      );
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

  return (
    <>
      <div
        className="background"
        style={{ backgroundImage: `url(${background3})` }}
      >
        <div className="Center">
          <NESContainer title="Play">
            <h1 className="press-start-font">Word Wolf</h1>
          </NESContainer>
        </div>
        <div className="container-all">
          <RoleWordOverlay isVisible={roleOverlay} word={word} isWolf={isWolf} />
          <div className="container-top">
            <h1>{!isWolf ? word || "Role: " + role : "Role: " + role}</h1>
            <div className="info">
              <TimerDisplay
                label={phase !== "discussion" ? "Round time" : "Discussion time"}
                timer={phase !== "discussion" ? roundTimer : discussionTimer}
              />
              <p>Role: {role}</p>
            </div>
            <div className={`player-details ${startPlayers.length % 2 !== 0 ? "odd-last-centered" : ""}`}>
              {startPlayers.map((player, index) => (
                <div key={player.userId} className="player-info">
                  <img
                    src={getDomain() + "/" + player.avatarUrl + `?v=${timestamp}`}
                    alt={`${player.username}'s avatar`}
                    className={`player-avatar ${player.userId === playerTurn ? "player-avatar-turn" : ""}`}
                  />
                  <p>{player.username}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="container-bottom">
            <div className="chat-align">
              <h3>Clues</h3>
              <div className="log-area" ref={clueLogRef}>
                {clueMessages.map((msg, index) => (
                  <div key={index}>
                    {msg.username}: {msg.content}
                  </div>
                ))}
              </div>
              <div className="input-area">
                <input
                  type="text"
                  value={draftClueMessage}
                  onChange={(e) => setDraftClueMessage(e.target.value)}
                  disabled={
                    phase !== "clue" || !isCurrentPlayerTurn || hasSentClue
                  }
                  onKeyPress={(e) => e.key === "Enter" && sendClue()}
                  placeholder="Type a clue..."
                />
                <CustomButton
                  text="Send"
                  className="send hover-orange"
                  onClick={sendClue}
                  disabled={
                    phase !== "clue" || !isCurrentPlayerTurn || hasSentClue
                  }
                />
              </div>
            </div>
            <div className="chat-align">
              <h3>Chat</h3>
              <div className="log-area" ref={chatLogRef}>
                {chatMessages.map((msg, index) => (
                  <div key={index}>
                    {msg.username}: {msg.content}
                  </div>
                ))}
              </div>
              <div className="input-area">
                <input
                  type="text"
                  value={draftChatMessage}
                  onChange={(e) => setDraftChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  disabled={phase !== "discussion"}
                />
                <CustomButton
                  text="Send"
                  className="send hover-orange"
                  onClick={sendMessage}
                  disabled={phase !== "discussion"}
                />
              </div>
            </div>
          </div>
          <InfoBar
            currentRound={`${currentRound}/${maxRound}`}
            role={role}
            word={word}
            clueTimer={clueTimer}
          />
          {voteOverlay && (
            <VotingOverlay
              word={word}
              players={players}
              onVote={sendVote}
              hasVoted={hasAlreadyVoted}
              isVisible={voteOverlay}
              results={gameResult}
              displayResults={showResults}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default GameDemo;