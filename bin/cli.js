#!/usr/bin/env node

const chalk = require('chalk');
const ora = require('ora');
const CaptchaGuesser = require('../lib');
const Config = require('../lib/config');

const config = Config.loadFromEnv();

async function loading(promise, text, doneText) {
  const spinner = ora(text).start();

  try {
    const result = await promise;

    spinner.succeed(doneText);

    return result;
  } catch (e) {
    spinner.fail(e);

    throw e;
  }
}

require('yargs') // eslint-disable-line
  .command(
    'test',
    'Test if a provider is functional',
    (yargs) => {
      yargs
        .option('provider', {
          alias: 'p',
          describe: 'Provider to test',
          choices: Object.keys(CaptchaGuesser.providers),
          required: true,
        })
        .option('live', {
          describe: 'Test live data',
          type: 'boolean',
          default: false,
        })
        .option('interations', {
          alias: 'i',
          describe: 'Interation to do on live data',
          type: 'number',
          default: 10,
        })
      ;
    },
    async (argv) => {
      const cc = new CaptchaGuesser(config);
      const Provider = CaptchaGuesser.providers[argv.provider];

      const provider = new Provider();
      
      const assets = await loading(require('../assets/loader')( // eslint-disable-line
        argv.provider,
        argv.live,
        argv.interations
      ), 'Loading assets...', 'Assets loaded.');

      const results = await loading(Promise.all(
        Object.keys(assets).map(async key => {
          const { img, code } = assets[key];
          
          const guessedCode = await cc.resolve(img, provider);

          return { key, code, guessedCode };
        })
      ), 'Processing...', 'Processed.');

      let validCounter = 0;

      for (const item of results) {
        const { key, code, guessedCode } = item;

        if (typeof code === 'function') {
          const isValid = await code(guessedCode);

          if (isValid) {
            validCounter++;
          }

          console.log(
            key,
            '>',
            'expected=N/A',
            `actual=${ isValid ? chalk.blue(guessedCode) : guessedCode }`,
            `valid=${ isValid ? chalk.green('YES') : chalk.red('NO') }`
          );
        } else {
          if (code === guessedCode) {
            validCounter++;
          }

          console.log(
            key,
            '>',
            `expected=${ chalk.blue(code) }`,
            `actual=${ code === guessedCode ? chalk.blue(guessedCode) : guessedCode }`,
            `passed=${ code === guessedCode ? chalk.green('YES') : chalk.red('NO') }`
          );
        }
      }

      console.log(
        chalk.blue('Success rate:'),
        chalk.yellow(validCounter / Object.keys(assets).length * 100)
      );
    }
  )
  .help()
  .argv;
