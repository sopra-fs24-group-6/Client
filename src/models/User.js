/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.password= null;
    this.createdAt=null;
    this.wins = null;
    this.losses = null;
    this.winlossratio = null;
    Object.assign(this, data);
  }
}

export default User;
