'use strict';

const DynamoService = require('./service/DynamoService');
const LexService = require('./service/LexService');
const MainService = require('./service/MainService');
const DistractionService = require('./service/DistractionService');
const MessengerService = require('./service/MessengerService');
const res = require('./service/ResponseService');

module.exports = {
  KeywordResponses: function (event, context, callback) {
    console.log('KeywordResponses', event);

    return DynamoService.findTrigger(event.currentIntent)
      .then(trigger => MessengerService.sendMsgArray(trigger.messages, event.userId))
      .then(selected => LexService.MainBranchRes(event.sessionAttributes, selected))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  },

  RandomDistraction: function (event, context, callback) {
    console.log('RandomDistraction', event);

    return DistractionService.pickRdm(event)
      .then(selected => LexService.NextActionRes(event, selected))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  },

  FeelingScore: function (event, context, callback) {
    console.log('FeelingScore', event);

    return MainService.processLevel(event)
      .then(selected => LexService.NextActionRes(event, selected))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  },

  CompleteDistraction: function (event, context, callback) {
    console.log('CompleteDistraction', event);

    return MessengerService.sendDynamic('encouragement', event.userId)
      .then(() => LexService.MainBranchRes(event.sessionAttributes))
      .then(response => res.ok(callback, response))
      .catch(err => res.handleError(err, callback));
  }
};
