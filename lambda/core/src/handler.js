'use strict';

const DynamoService = require('./service/DynamoService');
const LexService = require('./service/LexService');
const MainService = require('./service/MainService');
const DistractionService = require('./DistractionService');
const res = require('./service/ResponseService');

module.exports = {
  KeywordResponses: function (event, context, callback) {
    console.log(event);

    return DynamoService.findTrigger(event.currentIntent)
      .then(trigger => MainService.sendStatements(trigger.messages, event.userId))
      .then(selected => LexService.MainBranchRes(event.sessionAttributes, selected))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  },

  RandomDistraction: function (event, context, callback) {
    console.log(event);

    return DistractionService.pickRdm(event)
      .then(selected => LexService.NextActionRes(event, selected))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  },

  FeelingScore: function (event, context, callback) {
    console.log(event);

    return MainService.processLevel(event)
      .then(selected => LexService.NextActionRes(event, selected))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  }
};
