'use strict';

const Bluebird = require('bluebird');
const MessengerService = require('./MessengerService');
const DynamoService = require('./DynamoService');
const Utils = require('./Utils');

module.exports = {
  sendStatements: function (messagesJSON, userId) {
    if (!messagesJSON || !userId) {
      return Bluebird.reject(new Error('trigger or userId was not supplied'));
    }

    const messages = JSON.parse(messagesJSON);

    if (!Array.isArray(messages) || messages.length === 0) {
      return Bluebird.resolve();
    }

    return Bluebird.each(messages, msg => MessengerService.sendMessages(msg, userId));
  },

  findNextAction: function (completedDistractions = null, distractions) {
    const completed = Utils.returnArray(JSON.parse(completedDistractions));

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
