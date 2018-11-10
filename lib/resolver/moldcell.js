const BaseAWSResolver = require('./base-aws');
const sharp = require('sharp');
const Image = require('../entities/image');

class MoldcellResolver extends BaseAWSResolver {
  async resolve(image, config) {
    const rekognition = new (this.aws(config).Rekognition);
    const processedImage = await this.process(image);

    const result = await rekognition.detectText({
      Image: { Bytes: processedImage.base64Buffer }
    }).promise();

    return this.guessResult(result);
  }

  guessResult(result) {
    const availableResults = result.TextDetections  
      .filter(r => r.Type === 'WORD')
      .sort((a, b) => b.Confidence - a.Confidence)
      .map(r => r.DetectedText.replace(/[^a-z]+/i, ''))
      .filter(r => r.length === MoldcellResolver.CAPTCHA_LENGTH)
    ;

    return availableResults.length > 0
      ? availableResults.shift().toUpperCase()
      : null;
  }

  async process(image) {
    const ptr = sharp(image.buffer);

    ptr
      .blur(1)
      .median(2)
      .gamma(3.0)
      .greyscale()
    ;

    return new Image('', await ptr.toBuffer());
  }

  static get CAPTCHA_LENGTH() {
    return 5;
  }
}

module.exports = MoldcellResolver;
