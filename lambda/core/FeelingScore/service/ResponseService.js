const Bluebird = require('bluebird');

module.exports = {
  ok: function (callback, data) {
    return new Bluebird((resolve, reject) => {
      if (!callback) return reject('callback is required');

      return resolve(callback(null, data));
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

      console.error(error);
      return resolve(callback(null, map[error.name]));
    });
  }
};
