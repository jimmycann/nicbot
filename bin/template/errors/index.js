const util = require('util');

const DbObjectNotFoundError = function(objectType, objectId) {
  Error.call(this);
  Error.captureStackTrace(this, DbObjectNotFoundError);
  this.name = 'ObjectNotFoundError';
  this.message = `${objectType} "${objectId}" was not found.`;
  this.status = this.statusCode = 404;
};

util.inherits(DbObjectNotFoundError, Error);

const AuthorisationError = function(message) {
  Error.call(this);
  Error.captureStackTrace(this, AuthorisationError);
  this.name = 'AuthorisationError';
  this.message = message;
};

util.inherits(AuthorisationError, Error);

const ValidationError = function(message) {
  Error.call(this);
  Error.captureStackTrace(this, ValidationError);
  this.name = 'ValidationError';
  this.message = message;
};
util.inherits(ValidationError, Error);

module.exports = {
  DbObjectNotFoundError: DbObjectNotFoundError,
  AuthorisationError: AuthorisationError,
  ValidationError: ValidationError
};
