const Bluebird = require('bluebird');
const Joi = require('joi');
const Schema = require('./Schema');
const Dynasty = require('../model');
const res = require('./ResponseService');

const FIND_SCHEMA = Joi.object().keys({
  table: Joi.string().required(),
  keywords: Joi.array().items(Joi.string()).required()
});

const CREATE_SCHEMA = Joi.object().keys({
  name: Joi.string().required(),
  hash: Joi.string().required()
});

const INSERT_SCHEMA = Joi.object().keys({
  table: Joi.string().required(),
  rows: Joi.array().required()
});

module.exports = {
  findAll: function (payload, callback) {
    if (!payload || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Schema.validate(FIND_SCHEMA, payload)
      .then(payload => Dynasty.table(`${process.env.NODE_ENV}-${payload.table}`).batchFind(payload.keywords))
      .then(result => res.sendSuccess(callback, result));
  },

  createTable: function (payload, callback) {
    if (!payload || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Schema.validate(CREATE_SCHEMA, payload)
      .then(payload => Dynasty.create(`${process.env.NODE_ENV}-${payload.name}`, { key_schema: { hash: [ payload.hash, 'string' ] } }))
      .then(() => res.sendCreated(callback));
  },

  insertRows: function (payload, callback) {
    if (!payload || !callback) {
      return Bluebird.reject(new Error('event and callback are required'));
    }

    return Schema.validate(INSERT_SCHEMA, payload)
      .then(() => Dynasty.table(`${process.env.NODE_ENV}-${payload.table}`))
      .then(targetTable => {
        if (!targetTable) {
          return Bluebird.reject(new Error('The requested table does not exist'));
        }

        return payload.rows.map(row => targetTable.insert(row));
      })
      .then(() => res.sendCreated(callback));
  }
};
