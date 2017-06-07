const Bluebird = require('bluebird');
const Joi = require('joi');
const Schema = require('./Schema');
const Dynasty = require('../model');
const res = require('./ResponseService');

const SCHEMA = Joi.object().keys({
  name: Joi.string().required(),
  hash: Joi.string().required()
});

module.exports = {
  createTable: function (payload, callback) {
    if (!payload || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Schema.validate(SCHEMA, payload)
      .then(payload => Dynasty.create(payload.name, { key_schema: { hash: [ payload.hash, 'string' ] } }))
      .then(() => res.sendCreated(callback));
  }
};
