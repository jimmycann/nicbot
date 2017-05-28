'use strict';

const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'dynamo.js'))(env);
const Dynasty = require('dynasty')({
  accessKeyId: process.env.NICBOT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NICBOT_AWS_SECRET_ACCESS_KEY,
  region: process.env.NICBOT_AWS_REGION || 'us-east-1'
}, `${config.host}:${config.port}`);

module.exports = Dynasty;
