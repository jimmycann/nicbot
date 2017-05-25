const Credstash = require('nodecredstash');
const credstash = new Credstash({table: 'credentials-store', kmsKey: process.env.KMS_KEY, awsOpts: {region: 'us-east-1'}});

module.exports = credstash;
