'use strict';

const Bluebird = require('bluebird');
const MessengerService = require('./MessengerService');
const Utils = require('./Utils');

module.exports = {
  pickAndSend: function (event, data) {
    console.log('LevelTwoService.pickAndSend...');

    if (!event) {
      return Bluebird.reject(new Error('event was not supplied'));
    }

    const messages = Utils.isJson(data);

    return MessengerService.sendMsgArray(messages[Utils.rdmKey(messages)], event.userId)
      .then(() => data);
  },

  emergency: function (event, data) {
    console.log('LevelTwoService.pickAndSend...');

    if (!event) {
      return Bluebird.reject(new Error('event was not supplied'));
    }

    const messages = Utils.isJson(data);

    return MessengerService.sendMsgArray(messages[Utils.rdmKey(messages)], event.userId)
      .then(() => 'end');
  }
};
