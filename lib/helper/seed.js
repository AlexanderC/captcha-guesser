const uuidv4 = require('uuid/v4');

class Seed {
  static get id() {
    return uuidv4();
  }
}

module.exports = Seed;
