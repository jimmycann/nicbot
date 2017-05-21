const Credstash = require('nodecredstash');
const credstash = new Credstash({table: 'credentials-store', kmsKey: process.env.KMS_KEY, awsOpts: {region: 'ap-southeast-2'}});

module.exports = credstash;
