const Bluebird = require('bluebird');

module.exports = {
  sendCreated: function (callback) {
    return new Bluebird((resolve, reject) => {
      if (!callback) return reject('callback is required');

      return resolve(callback(null, {
        statusCode: 201,
        body: {
          message: 'Created'
        }}));
    });
  },

  sendSuccess: function (callback) {
    return new Bluebird((resolve, reject) => {
      if (!callback) return reject('callback is required');

      return resolve(callback(null, {
        statusCode: 200,
        body: {
          message: 'OK'
        }}));
    });
  },

  sendNoContent: function (callback) {
    return new Bluebird((resolve, reject) => {
      if (!callback) return reject('callback is required');

      return resolve(callback(null, {
        statusCode: 204,
        body: {}}));
    });
  },

  handleError: function (error, callback) {
    const map = {
      'AuthorisationError': {statusCode: 401, body: {message: 'Not Authorized'}},
      'ObjectNotFoundError': {statusCode: 404, body: {message: 'Not Found'}},
      'ValidationError': {statusCode: 400, body: { message: 'Bad Request' }}
    };

    return new Bluebird((resolve, reject) => {
      if (!error || !callback) return reject('callback and error are required');

      return resolve(callback(null, map[error.name]));
    });
  }
};
