'use strict';

const Bluebird = require('bluebird');
const MessengerService = require('./MessengerService');
const DynamoService = require('./DynamoService');
const Utils = require('./Utils');

const MSG_DELAY = Math.floor(Math.random() * (process.env.DELAY_MULTIPLIER || 1000));

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

  findNextAction: function (completedDistractions = null, distractions) {
    const completed = Utils.returnArray(completedDistractions);

    return this.removeCompleted(completed, distractions)
      .then(distMap => {
        if (!distMap || distMap.length === 0) {
          return Object.assign({}, distractions[Utils.rdmKey(distractions)], {
            clearCompleted: true
          });
        }

        return Object.assign({}, distMap[Utils.rdmKey(distMap)]);
      });
  },

  removeCompleted: function (completed, distractions) {
    return Bluebird.filter(Utils.returnArray(distractions), (distraction) => {
      if (!completed.includes(distraction.intentName)) {
        return distraction;
      }
    });
  },

  pickRdmDistraction: function (event) {
    return DynamoService.findAllDistractions(event)
      .then(distractions => this.findNextAction(this.returnCompletedDistractions(event.sessionAttributes), distractions));
  },

  returnCompletedDistractions: function (sessionAttributes) {
    if (!sessionAttributes) {
      return [];
    }
    return sessionAttributes.completedDistractions || [];
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
          return this.pickRdmDistraction(event);
        }

        return feeling;
      });
  }
};
