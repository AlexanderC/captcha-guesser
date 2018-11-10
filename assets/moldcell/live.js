const axios = require('axios'); 
const https = require('https');

function id() {
  return (Date.now() + (Math.random() * (1000000000 - 10000) + 10000)) * (10 ** 4);
}

module.exports = async (amount) => {
  const client = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false,
    }),
  });

  const assets = {};

  for (let i = 0; i < amount; i++) {
    const { url, sid } = (await client.get(
      `https://www.moldcell.md/rom/private/captcha/refresh/websms_main_form?${ id() }`
    )).data.data;

    const imgUrl = `https://www.moldcell.md${ url }`;
    
    const img = Buffer.from(
      (await client.get(imgUrl, { responseType: 'arraybuffer' })).data,
      'binary'
    );

    assets[imgUrl] = {
      img,
      async code(x) {
        const result = await client.get(
          `https://www.moldcell.md/rom/mobile/ajax/captcha/validate?text=${ x }&csid=${ sid }`,
          { responseType: 'text' }
        );

        return result.data == '2';
      },
    };
  }

  return assets;
};
