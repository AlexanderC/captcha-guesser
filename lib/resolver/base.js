const NotImplementedError = require('../error/not-implemented');

class BaseResolver {
  async resolve(image, config) {
    return NotImplementedError.promise();
  }
}

module.exports = BaseResolver;
