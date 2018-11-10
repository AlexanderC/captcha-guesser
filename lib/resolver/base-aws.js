const BaseResolver = require('./base');
const AWS = require('aws-sdk');

class BaseAWSResolver extends BaseResolver {
  aws(config) {
    const { accessKeyId, secretAccessKey, region } = config.raw;

    AWS.config.update({ accessKeyId, secretAccessKey, region });

    return AWS;
  }
}

module.exports = BaseAWSResolver;
