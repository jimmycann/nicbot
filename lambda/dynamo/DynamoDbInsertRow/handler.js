'use strict';

const DynamoService = require('./service/DynamoService');
const res = require('./service/ResponseService');

module.exports.insertRows = (event, context, callback) => {
  return DynamoService.insertRows(event, callback)
    .catch(err => res.handleError(err, callback));
};
