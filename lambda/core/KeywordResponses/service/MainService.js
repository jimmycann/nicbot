const Bluebird = require('bluebird');
const MessengerService = require('./MessengerService');

module.exports = {
  sendStatements: function (trigger, userId) {
    if (!trigger || !userId) {
      return Bluebird.reject(new Error('trigger or userId was not supplied'));
    }

    if (!Array.isArray(trigger.messages) || trigger.messages.length === 0) {
      return;
    }

    return Bluebird.each(trigger.messages, (msg) => MessengerService.sendMessage(msg, userId));
  }
};
