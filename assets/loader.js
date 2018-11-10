const IMG_EXT = '.png';
const CODE_EXT = '.txt';

const fs = require('fs-extra');
const path = require('path');

module.exports = async (provider, live, iterations) => {
  const assets = {};
  const providerPath = path.join(__dirname, provider);

  if (live) {
    const generator = require(path.join(providerPath, 'live.js'));

    return generator(iterations);
  }

  const files = (
    await fs.readdir(providerPath)
  ).map(f => path.join(providerPath, f));

  for (const img of files.filter(f => f.endsWith(IMG_EXT))) {
    const key = path.basename(img, IMG_EXT);
    const code = await fs.readFile(path.join(providerPath, key + CODE_EXT));

    assets[key] = { img, code: code.toString().trim() };
  }

  return assets;
};
