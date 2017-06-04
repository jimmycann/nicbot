'use strict';

const DynamoService = require('./service/DynamoService');
const res = require('./service/ResponseService');

module.exports.findAll = (event, context, callback) => {
  console.log(event);

  return DynamoService.findKeywordResponse(event, callback)
    .catch(err => res.handleError(err, callback));
};
