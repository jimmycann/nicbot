const Bluebird = require('bluebird');
const Joi = require('joi');
const Schema = require('./Schema');
const Dynasty = require('../model');
const res = require('./ResponseService');

const SCHEMA = Joi.object().keys({
  table: Joi.string().required(),
  keywords: Joi.array().items(Joi.string()).required()
});

module.exports = {
  findAll: function (payload, callback) {
    if (!payload || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Schema.validate(SCHEMA, payload)
      .then(payload => Dynasty.table(`${process.env.NODE_ENV}-nicbot-${payload.table}`).batchFind(payload.keywords))
      .then(result => res.sendSuccess(callback, result));
  }
};
