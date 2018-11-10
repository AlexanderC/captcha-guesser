const NotImplementedError = require('../error/not-implemented');

class BaseLoader {
  async load() {
    return NotImplementedError.promise();
  }
}

module.exports = BaseLoader;
