const Bluebird = require('bluebird');
const Dynasty = require('../model');
const res = require('./ResponseService');

module.exports = {
  findKeywordResponse: function (event, callback) {
    if (!event || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Dynasty.table('keywords').find(event.currentIntent.name)
      .tap(keyword => {
        if (!keyword) {
          return res.handleError('ObjectNotFoundError');
        }
      });
  }
};
