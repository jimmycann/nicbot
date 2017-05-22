'use strict';

if (!process.env.NICBOT_AWS_ACCESS_KEY_ID || !process.env.NICBOT_AWS_SECRET_ACCESS_KEY) {
  throw new Error('NICBOT_AWS_ACCESS_KEY_ID or NICBOT_AWS_SECRET_ACCESS_KEY was not supplied in your environment variables');
}

const fs = require('fs');
const Bluebird = require('bluebird');
const path = require('path');
Bluebird.promisifyAll(fs);

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-southeast-2',
  accessKeyId: process.env.NICBOT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NICBOT_AWS_SECRET_ACCESS_KEY
});
const Lex = new AWS.LexModelBuildingService();

const options = {
  LexDir: '../lex',
  name: process.argv[2] || 'nicbot',
  versionOrAlias: process.argv[3] || '$LATEST'
};

Lex.getBot({
  name: options.name,
  versionOrAlias: options.versionOrAlias
}).promise()
  .then(bot => {
    if (!fs.existsSync(path.join(__dirname, options.LexDir))) {
      fs.mkdir(path.join(__dirname, options.LexDir));
    }
    return fs.writeFileAsync(path.join(__dirname, `${options.LexDir}/${options.name}-${options.versionOrAlias}-bkup.json`), JSON.stringify(bot, null, 2));
  })
  .catch(err => {
    throw new Error('Unable to complete backup', err);
  });
