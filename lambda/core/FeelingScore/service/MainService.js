const Bluebird = require('bluebird');
const DynamoService = require('./service/DynamoService');
const MessengerService = require('./service/MessengerService');

module.exports = {
  processLevel: function (event) {
    if (!event) {
      return Bluebird.reject(new Error('event is required'));
    }

    return DynamoService.findLevel(event.currentIntent.slots.StressLevel || event.sessionAttributes.StressLevel || '1')
      .tap(path => Bluebird.all(path.messages.map(msg => MessengerService.sendStatement(msg, event.userId))));
  }
};
