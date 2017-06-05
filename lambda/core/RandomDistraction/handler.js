'use strict';

const DynamoService = require('./service/DynamoService');
const LexService = require('./service/LexService');
const MainService = require('./service/MainService');
const res = require('./service/ResponseService');

module.exports.findAll = (event, context, callback) => {
  console.log(event);

  return DynamoService.findAllDistractions(event, callback)
    .then(distractions => MainService.findNextAction(event.sessionAttributes, distractions))
    .then(selected => LexService.buildResponse(event.sessionAttributes, selected))
    .then(response => res.ok(callback, response))
    .catch(err => res.handleError(err, callback));
};
