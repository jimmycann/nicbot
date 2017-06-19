'use strict';

const request = require('request-promise');

const DynamoService = require('./DynamoService');
const Utils = require('./Utils');

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
        if (!Array.isArray(dynamic.messages) && dynamic.messages.length === 0) {
          return;
        }

        return this.sendMessages(dynamic.messages[Utils.rdmKey(dynamic.messages)], userId);
      });
  }
};
