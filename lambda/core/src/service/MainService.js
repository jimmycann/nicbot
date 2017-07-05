'use strict';

const Bluebird = require('bluebird');
const MessengerService = require('./MessengerService');
const DynamoService = require('./DynamoService');
const DistractionService = require('./DistractionService');
const TwoPlusService = require('./TwoPlusService');

module.exports = {
  processLevel: function (event) {
    console.log('MainService.processLevel...');

    if (!event) {
      return Bluebird.reject(new Error('event is required'));
    }

    const level = event.currentIntent.slots.StressLevel || event.sessionAttributes.StressLevel || '1';

    return DynamoService.findLevel(level)
      .tap(() => MessengerService.sendDynamic('encouragement', event.userId))
      .then(feeling => this.levelFlow(event, level, feeling));
  },

  levelFlow: function (event, level, data) {
    const flow = {
      '1': () => DistractionService.pickRdm(event),
      '2': () => TwoPlusService.pickAndSend(event, data),
      '3': () => TwoPlusService.emergency(event, data)
    };
    return (flow[level] || flow['1'])();
  }
};
