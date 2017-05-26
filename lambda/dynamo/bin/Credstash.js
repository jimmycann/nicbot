const Credstash = require('nodecredstash');
const credstash = new Credstash({
  table: 'credentials-store',
  kmsKey: process.env.NICBOT_KMS_KEY,
  awsOpts: { region: process.env.NICBOT_AWS_REGION || 'us-east-1' }
});

module.exports = credstash;
