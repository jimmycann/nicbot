'use strict';

const res = require('./service/ResponseService');

module.exports.newFunction = (event, context, callback) => {
  return aNew.promise(event, callback)
    .catch(err => res.handleError(err, callback));
};
