const path = require('path');
const Seed = require('../helper/seed');

class File {
  constructor(originalPath, buffer) {
    this.originalPath = originalPath;
    this.buffer = buffer;
  }

  get uniqueBasename() {
    return `${ this.name }_${ Seed.id() }${ this.extension }`;
  }

  get uniqueName() {
    return `${ this.name }_${ Seed.id() }`;
  }
  
  get basename() {
    return path.parse(this.originalPath).base;
  }

  get name() {
    return path.parse(this.originalPath).name;
  }

  get extension() {
    return path.parse(this.originalPath).ext;
  }

  get base64Buffer() {
    return Buffer.from(this.buffer.toString('base64'), 'base64')
  }
}

module.exports = File;
