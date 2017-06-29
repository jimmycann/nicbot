'use strict';

const Bluebird = require('bluebird');
const MessengerService = require('./MessengerService');
const DynamoService = require('./DynamoService');
const DistractionService = require('./DistractionService');

module.exports = {
  processLevel: function (event) {
    console.log('MainService.processLevel...');

    if (!event) {
      return Bluebird.reject(new Error('event is required'));
    }

    return DynamoService.findLevel(event.currentIntent.slots.StressLevel || event.sessionAttributes.StressLevel || '1')
      .tap(feeling => MessengerService.sendMsgArray(feeling.messages, event.userId))
      .tap(() => MessengerService.sendDynamic('encouragement', event.userId))
      .then(feeling => {
        if (feeling.tryDistraction) {
          return DistractionService.pickRdm(event);
        }

        return feeling;
      });
  }
};
