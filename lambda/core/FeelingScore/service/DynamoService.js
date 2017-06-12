const Bluebird = require('bluebird');
const Dynasty = require('../model');

module.exports = {
  findLevel: function (level) {
    if (!level) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Dynasty.table(`${process.env.NODE_ENV}-nicbot-feeling`).find(level)
      .tap(feeling => {
        if (!feeling) {
          return Bluebird.reject(new Error('ObjectNotFoundError'));
        }
      });
  }
};
