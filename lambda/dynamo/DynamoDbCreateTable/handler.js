'use strict';

const DynamoService = require('./service/DynamoService');
const res = require('./service/ResponseService');

module.exports.createTable = (event, context, callback) => {
  return DynamoService.createTable(event, callback)
    .catch(err => res.handleError(err, callback));
};
