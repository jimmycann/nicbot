'use strict';

const Bluebird = require('bluebird');
const DynamoService = require('./DynamoService');
const Utils = require('./Utils');

module.exports = {
  findNext: function (completedDistractions = null, distractions) {
    const completed = Utils.returnArray(completedDistractions);

    return this.removeCompleted(completed, distractions)
      .then(distMap => {
        if (!distMap || distMap.length === 0) {
          return Object.assign({}, distractions[Utils.rdmKey(distractions)], {
            clearCompleted: true
          });
        }

        return Object.assign({}, distMap[Utils.rdmKey(distMap)]);
      });
  },

  removeCompleted: function (completed = [], distractions) {
    if (!Array.isArray(distractions) || distractions.length === 0) {
      return Bluebird.reject(new Error('No distractions were found'));
    }

    return Bluebird.filter(distractions, distraction => {
      if (!completed.includes(distraction.intentName)) {
        return distraction;
      }
    });
  },

  pickRdm: function (event) {
    return DynamoService.findAllDistractions(event)
      .then(distractions => {
        if (!distractions || distractions.length === 0) {
          return Bluebird.reject(new Error('No distractions were found'));
        }

        return this.findNext(this.returnCompleted(event.sessionAttributes), distractions);
      });
  },

  returnCompleted: function (sessionAttributes) {
    if (!sessionAttributes) {
      return [];
    }

    return Utils.isJson(sessionAttributes.completedDistractions) || [];
  }
};
