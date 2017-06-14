
'use strict';

const DynamoService = require('./service/DynamoService');
const res = require('./service/ResponseService');

module.exports = {
  findAll: function (event, context, callback) {
    return DynamoService.findAll(event, callback)
      .catch(err => res.handleError(err, callback));
  },

  createTable: function (event, context, callback) {
    return DynamoService.createTable(event, callback)
      .catch(err => res.handleError(err, callback));
  },

  insertRows: function (event, context, callback) {
    return DynamoService.insertRows(event, callback)
      .catch(err => res.handleError(err, callback));
  }
};
