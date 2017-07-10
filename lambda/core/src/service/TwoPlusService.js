'use strict';

const Bluebird = require('bluebird');
const MessengerService = require('./MessengerService');
const Utils = require('./Utils');

module.exports = {
  pickAndSend: function (event, data) {
    console.log('LevelTwoService.pickAndSend...');

    if (!event || !data) {
      return Bluebird.reject(new Error('event or data was not supplied'));
    }

    const messages = Utils.isJson(data.messages);

    if (!Array.isArray(messages) || messages.length === 0) {
      return Bluebird.reject(new Error('messages is not an array or undefined', messages));
    }

    return MessengerService.sendMsgArray(messages[Utils.rdmKey(messages)], event.userId)
      .then(() => data);
  },

  emergency: function (event, data) {
    console.log('LevelTwoService.emergency...');

    if (!event || !data) {
      return Bluebird.reject(new Error('event or data was not supplied'));
    }

    const messages = Utils.isJson(data.messages);

    if (!Array.isArray(messages) || messages.length === 0) {
      return Bluebird.reject(new Error('messages is not an array or undefined', messages));
    }

    return MessengerService.sendMsgArray(messages[Utils.rdmKey(messages)], event.userId)
      .then(() => 'end');
  }
};
