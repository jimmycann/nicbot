const Bluebird = require('bluebird');
const Joi = require('joi');
const Schema = require('./Schema');
const { Dynasty } = require('../model');
const res = require('./ResponseService');

const ROW_ITEMS = Joi.object().keys({
  name: Joi.string().required(),
  response: Joi.string().required()
});

const SCHEMA = Joi.object().keys({
  table: Joi.string().required(),
  rows: Joi.array(ROW_ITEMS).required()
});

module.exports = {
  insertRows: function (event, callback) {
    if (!event || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    const payload = JSON.parse(event.body);

    return Schema.validate(SCHEMA, payload)
      .then(payload => {
        if (!Dynasty[payload.table]) {
          return Bluebird.reject(new Error('The requested table does not exist'));
        }
        return payload.rows.map(row => Dynasty[payload.table].insert(row));
      })
      .then(() => res.sendCreated(callback));
  }
};
