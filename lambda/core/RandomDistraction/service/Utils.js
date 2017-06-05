'use strict';

module.exports = {
  returnArray: function (data) {
    if (!data || !Array(data).isArray()) {
      return [];
    }
    return data;
  }
};
