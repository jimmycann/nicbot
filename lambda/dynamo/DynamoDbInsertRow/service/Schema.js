import Joi from 'joi';
import Bluebird from 'bluebird';
import { ValidationError } from '../errors';

export function validate (schema, payload, context) {
  return new Bluebird((resolve, reject) => {
    Joi.validate(payload, schema, { context }, err => {
      if (err) {
        return reject(new ValidationError(err.details[0].message));
      }
      return resolve(payload);
    });
  });
}

export default validate;
