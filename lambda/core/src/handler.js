'use strict';

const DynamoService = require('./service/DynamoService');
const LexService = require('./service/LexService');
const MainService = require('./service/MainService');
const res = require('./service/ResponseService');

module.exports = {
  KeywordResponses: function (event, context, callback) {
    console.log(event);

    return DynamoService.findTrigger(event.currentIntent)
      .then(trigger => MainService.sendStatements(trigger, event.userId))
      .then(selected => LexService.KeywordRes(event.sessionAttributes, selected))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  },

  RandomDistraction: function (event, context, callback) {
    console.log(event);

    return DynamoService.findAllDistractions(event, callback)
      .then(distractions => MainService.findNextAction(event.sessionAttributes.completedDistractions, distractions))
      .then(selected => LexService.RdmDistRes(event.sessionAttributes, selected))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  },

  FeelingScore: function (event, context, callback) {
    console.log(event);

    return MainService.processLevel(event)
      .then(selected => LexService.FeelingRes(event.sessionAttributes, selected))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  }
};
