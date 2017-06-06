const request = require('request-promise');

module.exports = {
  sendMessage: function (content, userId) {
    return request.post({
      url: `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      body: {
        recipient: { id: userId },
        message: { text: content }
      }
    });
  }
};