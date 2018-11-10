const BaseLoader = require('./base');
const fs = require('fs-extra');

class FsLoader extends BaseLoader {
  async load(location) {
    return fs.readFile(location);
  }
}

module.exports = FsLoader;
