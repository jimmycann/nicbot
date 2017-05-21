const YAML = require('yamljs');
const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const path = require('path');

const Credstash = require('./Credstash');
const credentialNames = [
  'test-db-password',
  'beta-sandbox-db-password',
  'sandbox-db-password',
  'live-db-password',
  'test-notification-token',
  'beta-sandbox-notification-token',
  'sandbox-notification-token',
  'live-notification-token'
];

let credentials = {
  'development-db-password': '',
  'development-notification-token': 'NOTIFICATION_SERVICE_TOKEN'
};

console.info('\nGenerating .environment/credentials.yml using KMS, this may take upwards of 15 seconds\n');

Bluebird.each(credentialNames, (name) => {
  return Credstash.getSecret({name: name, context: { doshii: 'true' }})
    .then(secret => (credentials[name] = secret));
})
.then(() => {
  if (!fs.existsSync(path.join(__dirname, '../.environment'))) {
    fs.mkdir(path.join(__dirname, '../.environment'));
  }
  return fs.writeFile(path.join(__dirname, '../.environment/credentials.yml'), YAML.stringify(credentials, 2));
})
.then(() => console.info('Credential generation is complete!\n'));
