'use strict';

const Bluebird = require('bluebird');
const Dynasty = require('../model');

module.exports = {
  findTrigger: function (currentIntent) {
    console.log('DynamoService.findTrigger...');

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
    console.log('DynamoService.findLevel...');

    if (!level) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Dynasty.table(`${process.env.NODE_ENV}-nicbot-feeling-score`).find(level)
      .tap(feeling => {
        if (!feeling) {
          return Bluebird.reject(new Error('ObjectNotFoundError'));
        }
      });
  },

  findAllDistractions: function (event) {
    console.log('DynamoService.findAllDistractions...');

    if (!event) {
      return Bluebird.reject(new Error('event is required'));
    }

    return Dynasty.table(`${process.env.NODE_ENV}-nicbot-distractions`).scan()
      .tap(distractions => {
        if (!distractions) {
          return Bluebird.reject(new Error('ObjectNotFoundError'));
        }
      });
  },

  findDynamic: function (type) {
    console.log('DynamoService.findDynamic...');

    return Dynasty.table(`${process.env.NODE_ENV}-nicbot-dynamic-message`).find(type);
  }
};
