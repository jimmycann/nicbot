'use strict';

const environment = {
  'development': () => ({
    host: process.env.DYNAMO_HOST || 'http://localhost',
    port: process.env.DYNAMO_PORT || 4567,
    password: process.env.DYNAMO_PASSWORD || ''
  }),
  'test': () => ({
    host: 'test.nicbot.com',
    port: 4567,
    password: ''
  }),
  'staging': () => ({
    host: 'staging.nicbot.com',
    port: 4567,
    password: ''
  }),
  'live': () => ({
    host: 'live.nicbot.com',
    port: 4567,
    password: ''
  })
};

module.exports = function (env) {
  return (environment[env] || environment['development'])();
};
