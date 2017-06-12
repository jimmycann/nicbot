const Bluebird = require('bluebird');
const DynamoService = require('./DynamoService');
const MessengerService = require('./MessengerService');

module.exports = {
  processLevel: function (event) {
    if (!event) {
      return Bluebird.reject(new Error('event is required'));
    }

    return DynamoService.findLevel(event.currentIntent.slots.StressLevel || event.sessionAttributes.StressLevel || '1')
      .tap(feeling => {
        if (Array.isArray(feeling.messages) && feeling.messages.length > 0) {
          return Bluebird.all(feeling.messages.map(msg => MessengerService.sendMessages(msg, event.userId)));
        }
      });
  }
};
