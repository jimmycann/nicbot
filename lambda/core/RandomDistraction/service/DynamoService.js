const Bluebird = require('bluebird');
const Dynasty = require('../model');

module.exports = {
  findAllDistractions: function (event, callback) {
    if (!event || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Dynasty.table('distractions').scan()
      .tap(distractions => {
        if (!distractions) {
          return Bluebird.reject(new Error('ObjectNotFoundError'));
        }
      });
  }
};
