
const request = require('request-promise');

module.exports = {
  sendMessage: function (content, userId) {
    return request.post({
      json: true,
      url: `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`,
      body: {
        recipient: { id: userId },
        message: { text: content }
      },
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
