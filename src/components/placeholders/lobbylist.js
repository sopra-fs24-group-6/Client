import Lobby from "models/Lobby";

const lobbieList = [
    new Lobby({
      id: 1,
      name: 'Public Lobby 1',
      lobbyAdmin: 'Player1',
      players: ['Player1', 'Player2', 'Player3'],
      playerLimit: 6,
      playerCount: 3,
      themes: ['Theme1', 'Theme2'],
      roundTimer: 60,
      clueTimer: 10,
      discussionTimer: 60,
      password: null
    }),
    new Lobby({
      id: 2,
      name: 'Private Lobby 1',
      lobbyAdmin: 'Player4',
      players: ['Player4', 'Player5'],
      playerLimit: 4,
      playerCount: 2,
      themes: ['Theme3', 'Theme4'],
      roundTimer: 45,
      clueTimer: 15,
      discussionTimer: 45,
      password: 'password123'
    }),
    new Lobby({
      id: 3,
      name: 'Public Lobby 2',
      lobbyAdmin: 'Player6',
      players: ['Player6'],
      playerLimit: 8,
      playerCount: 1,
      themes: ['Theme5', 'Theme6'],
      roundTimer: 90,
      clueTimer: 20,
      discussionTimer: 90,
      password: null
    })
  ];

  export default lobbieList;