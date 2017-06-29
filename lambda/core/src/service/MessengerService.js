'use strict';

const Bluebird = require('bluebird');
const request = require('request-promise');

const DynamoService = require('./DynamoService');
const Utils = require('./Utils');

const MSG_DELAY = Math.floor(Math.random() * (process.env.DELAY_MULTIPLIER || 1000)) + (process.env.DELAY_FLOOR || 1000);

module.exports = {
  sendMessages: function (content, userId) {
    return request.post({
      json: true,
      url: `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`,
      body: {
        recipient: { id: userId },
        message: { text: content }
      },
      headers: { 'Content-Type': 'application/json' }
    });
  },

  sendDynamic: function (type, userId) {
    return DynamoService.findDynamic(type)
      .then(dynamic => {
        if (!dynamic || !userId) return;

        const messages = Utils.isJson(dynamic.messages);

        if (!Array.isArray(messages) || messages.length === 0) {
          return;
        }

        return this.sendMessages(messages[Utils.rdmKey(messages)], userId);
      });
  },

  sendMsgArray: function (msgArr, userId) {
    if (!userId) {
      return Bluebird.reject(new Error('userId was not supplied'));
    }

    const messages = Utils.isJson(msgArr);

    if (Array.isArray(messages) && messages.length > 0) {
      return Bluebird.each(messages, msg => Bluebird.delay(MSG_DELAY)
        .then(() => this.sendMessages(msg, userId)))
        .then(() => Bluebird.delay(MSG_DELAY));
    }

    return Bluebird.resolve();
  }
};
