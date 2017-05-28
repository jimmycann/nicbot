const Joi = require('joi');
const Bluebird = require('bluebird');
const ValidationError = require('../errors').ValidationError;

module.exports = {
  validate: function (schema, payload, context) {
    return new Bluebird((resolve, reject) => {
      Joi.validate(payload, schema, { context }, err => {
        if (err) {
          return reject(new ValidationError(err.details[0].message));
        }
        return resolve(payload);
      });
    });
  }
};
