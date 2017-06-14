'use strict';

const environment = {
  'development': () => ({
    host: process.env.DYNAMO_HOST || 'http://localhost',
    port: process.env.DYNAMO_PORT || 4567,
    password: process.env.DYNAMO_PASSWORD || ''
  })
};

module.exports = function (env) {
  return (environment[env] || environment['development'])();
};
