class BaseError extends Error {
  static promise(...args) {
    return Promise.reject(new this(...args));
  }
}

module.exports = BaseError;
