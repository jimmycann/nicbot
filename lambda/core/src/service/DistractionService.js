'use strict';

const Bluebird = require('bluebird');
const DynamoService = require('./DynamoService');
const Utils = require('./Utils');

module.exports = {
  findNextAction: function (completedDistractions = null, distractions) {
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

  removeCompleted: function (completed, distractions) {
    return Bluebird.filter(Utils.returnArray(distractions), (distraction) => {
      if (!completed.includes(distraction.intentName)) {
        return distraction;
      }
    });
  },

  pickRdmDistraction: function (event) {
    return DynamoService.findAllDistractions(event)
      .then(distractions => {
        if (!distractions) {
          return Bluebird.reject(new Error('No distractions were found'));
        }

        return this.findNextAction(this.returnCompletedDistractions(event.sessionAttributes), distractions);
      });
  },

  returnCompletedDistractions: function (sessionAttributes) {
    if (!sessionAttributes) {
      return [];
    }

    return Utils.isJson(sessionAttributes.completedDistractions) || [];
  }
};
