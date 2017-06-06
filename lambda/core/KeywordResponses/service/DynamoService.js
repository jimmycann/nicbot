const Bluebird = require('bluebird');
const Dynasty = require('../model');

module.exports = {
  findTrigger: function (currentIntent) {
    if (!currentIntent) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Dynasty.table('triggers').find(currentIntent.name)
      .tap(triggers => {
        if (!triggers) {
          return Bluebird.reject(new Error('ObjectNotFoundError'));
        }
      });
  }
};
