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
  region: 'us-east-1',
  accessKeyId: process.env.NICBOT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NICBOT_AWS_SECRET_ACCESS_KEY
});
AWS.config.setPromisesDependency(Bluebird);
const Lex = new AWS.LexModelBuildingService();

const options = {
  LexDir: '../lex',
  name: process.argv[2] || 'NicBot',
  versionOrAlias: process.argv[3] || '$LATEST'
};

const writeBackup = function (resource, newFile) {
  return fs.writeFileAsync(path.join(__dirname, newFile), JSON.stringify(resource, null, 2));
};

const getBot = function () {
  return Lex.getBot({
    name: options.name,
    versionOrAlias: options.versionOrAlias
  }).promise()
    .then(bot => writeBackup(bot, `${options.LexDir}/bots/${options.name}-${options.versionOrAlias}-bkup.json`));
};

const getIntents = function () {
  return Lex.getIntents({
    maxResults: 50
  }).promise()
    .then(bot => writeBackup(bot, `${options.LexDir}/intents/${options.name}-${options.versionOrAlias}-bkup.json`));
};

const getSlotTypes = function () {
  return Lex.getSlotTypes({
    maxResults: 50
  }).promise()
    .then(bot => writeBackup(bot, `${options.LexDir}/slots/${options.name}-${options.versionOrAlias}-bkup.json`));
};

Bluebird.all([
  getBot(),
  getIntents(),
  getSlotTypes()
])
  .catch(err => {
    console.warn(err);
    process.exit();
  });
