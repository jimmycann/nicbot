'use strict';

const Bluebird = require('bluebird');
const MessengerService = require('./MessengerService');
const DynamoService = require('./DynamoService');
const DistractionService = require('./DistractionService');
const Utils = require('./Utils');

const MSG_DELAY = Math.floor(Math.random() * (process.env.DELAY_MULTIPLIER || 1000)) + (process.env.DELAY_FLOOR || 1000);

module.exports = {
  sendStatements: function (messagesJSON, userId) {
    if (!userId) {
      return Bluebird.reject(new Error('userId was not supplied'));
    }

    const messages = Utils.returnArray(messagesJSON);

    if (messages.length === 0) {
      return Bluebird.resolve();
    }

    return Bluebird.each(messages, msg => Bluebird.delay(MSG_DELAY)
      .then(() => MessengerService.sendMessages(msg, userId)));
  },

  processLevel: function (event) {
    if (!event) {
      return Bluebird.reject(new Error('event is required'));
    }

    return DynamoService.findLevel(event.currentIntent.slots.StressLevel || event.sessionAttributes.StressLevel || '1')
      .tap(feeling => {
        if (Array.isArray(feeling.messages) && feeling.messages.length > 0) {
          return Bluebird.each(feeling.messages, msg => Bluebird.delay(MSG_DELAY)
            .then(() => MessengerService.sendMessages(msg, event.userId)));
        }
      })
      .tap(() => MessengerService.sendDynamic('encouragement', event.userId))
      .then(feeling => {
        if (feeling.tryDistraction) {
          return DistractionService.pickRdm(event);
        }

        return feeling;
      });
  }
};
