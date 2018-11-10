const BaseError = require('./base');

class NotImplementedError extends BaseError {
  constructor() {
    super('Not implemented');
  }
}

module.exports = NotImplementedError;
