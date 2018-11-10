const dotenv = require('dotenv');

class Config {
  constructor(rawConfig) {
    this.rawConfig = rawConfig;
  }

  has(key) {
    return this.rawConfig.hasOwnProperty(key);
  }
  
  get(key, def = null) {
    return this.has(key) ? this.rawConfig[key] : def;
  }

  get raw() {
    return this.rawConfig;
  }

  static loadFromEnv(options = null) {
    const envConfig = dotenv.config(options);

    return new this(envConfig.parsed);
  }
}

module.exports = Config;
