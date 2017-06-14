const Credstash = require('nodecredstash');
const credstash = new Credstash({
  table: 'credentials-store',
  awsOpts: { region: process.env.NICBOT_AWS_REGION || 'us-east-1' }
});

module.exports = credstash;
