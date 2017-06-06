const Bluebird = require('bluebird');
const MessengerService = require('./MessengerService');

module.exports = {
  sendStatements: function (trigger, userId) {
    if (!trigger || !userId) {
      return Bluebird.reject(new Error('trigger or userId was not supplied'));
    }

    return Bluebird.each(trigger.messages, (msg) => MessengerService.sendMessage(msg, userId));
  }
};
