const Bluebird = require('bluebird');
const Dynasty = require('../model');

module.exports = {
  findTrigger: function (currentIntent) {
    if (!currentIntent) {
      return Bluebird.reject(new Error('currentIntent is required'));
    }

    return Dynasty.table('triggers').find(currentIntent.name)
      .tap(triggers => {
        if (!triggers) {
          return Bluebird.reject(new Error('ObjectNotFoundError'));
        }
      });
  }
};
