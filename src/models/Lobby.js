class Lobby {
  constructor(data = {}) {
    this.id = null;
    this.lobbyAdmin = null;
    this.name = null;
    this.password = null;
    this.players = null;
    this.playerLimit = null;
    this.PlayerCount = null;
    this.themes = null;
    this.rountTimer = null;
    this.clueTimer = null;
    this.discussionTimer = null;
    Object.assign(this, data);
  }
}

export default Lobby;
