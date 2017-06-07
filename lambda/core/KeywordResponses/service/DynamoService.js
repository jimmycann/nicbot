const Bluebird = require('bluebird');
const Dynasty = require('../model');

module.exports = {
  findTrigger: function (currentIntent) {
    if (!currentIntent) {
      return Bluebird.reject(new Error('currentIntent is required'));
    }

    return Dynasty.table(`${process.env.NODE_ENV}-nicbot-triggers`).find(currentIntent.name)
      .tap(triggers => {
        if (!triggers) {
          return Bluebird.reject(new Error('ObjectNotFoundError'));
        }
      });
  }
};
