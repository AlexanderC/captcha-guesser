const File = require('./file');

class Image extends File {
  get dataUri() {
    const ext = this.extension.toLowerCase().substr(1);

    if ([ 'png', 'jpg', 'jpeg' ].indexOf(ext) == -1) {
      throw new Error('Unsupported image type');
    }

    const source = this.buffer.toString('base64');
    const datURI = `data:image/${ ext == 'jpg' ? 'jped' : ext };base64,${ source }`;

    return Buffer.from(datURI);
  }
}

module.exports = Image;
