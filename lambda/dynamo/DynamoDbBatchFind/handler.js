'use strict';

const DynamoService = require('./service/DynamoService');
const res = require('./service/ResponseService');

module.exports.findAll = (event, context, callback) => {
  return DynamoService.findAll(event, callback)
    .catch(err => res.handleError(err, callback));
};
