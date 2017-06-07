const Bluebird = require('bluebird');
const Joi = require('joi');
const Schema = require('./Schema');
const Dynasty = require('../model');
const res = require('./ResponseService');

const SCHEMA = Joi.object().keys({
  table: Joi.string().required(),
  rows: Joi.array().required()
});

module.exports = {
  insertRows: function (payload, callback) {
    if (!payload || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Schema.validate(SCHEMA, payload)
      .then(() => {
        const targetTable = Dynasty.table(payload.table);
        if (!targetTable) {
          return Bluebird.reject(new Error('The requested table does not exist'));
        }
        return payload.rows.map(row => targetTable.insert(row));
      })
      .then(() => res.sendCreated(callback));
  }
};
