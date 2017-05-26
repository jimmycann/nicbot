const Bluebird = require('bluebird');
const Joi = require('joi');
const Schema = require('./Schema');
const { Dynasty } = require('../model');
const res = require('./ResponseService');

const SCHEMA = Joi.object().keys({
  name: Joi.string().required()
});

module.exports = {
  createTable: function (event, callback) {
    if (!event || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    const payload = JSON.parse(event.body);

    return Schema.validate(SCHEMA, payload)
      .then(payload => {
        if (Dynasty[payload.table]) {
          return Bluebird.reject(new Error('The requested table name already exists'));
        }
        return Dynasty.createTable(payload.name);
      })
      .then(() => res.sendCreated(callback));
  }
};
