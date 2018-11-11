const MoldcellResolver = require('./resolver/moldcell');
const OrangeResolver = require('./resolver/orange');
const UniteResolver = require('./resolver/unite');
const Loader = require('./loader/fs');
const Image = require('./entities/image');

class CaptchaGuesser {
  constructor(config) {
    this.config = config;
  }

  async resolve(image, provider) {
    if (image instanceof Buffer) {
      const artifact = new Image('', image);

      return provider.resolve(artifact, this.config);
    }

    const loader = new Loader();
    const buffer = await loader.load(image);
    const artifact = new Image(image, buffer);

    return provider.resolve(artifact, this.config);
  }

  static get providers() {
    return {
      moldcell: MoldcellResolver,
      orange: OrangeResolver,
      unite: UniteResolver,
    };
  }
}

module.exports = CaptchaGuesser;
