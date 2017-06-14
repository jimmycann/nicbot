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
  },

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
  },

  findAllDistractions: function (event, callback) {
    if (!event || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Dynasty.table(`${process.env.NODE_ENV}-nicbot-distractions`).scan()
      .tap(distractions => {
        if (!distractions) {
          return Bluebird.reject(new Error('ObjectNotFoundError'));
        }
      });
  }
};
