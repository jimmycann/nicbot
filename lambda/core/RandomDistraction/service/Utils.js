'use strict';

module.exports = {
  returnArray: function (data) {
    if (!data) {
      return [];
    }

    if (!Array.isArray(data)) {
      return [ data ];
    }

    return data;
  },

  rdmKey: function (arr) {
    if (!Array.isArray(arr)) {
      throw new Error('Array must be passed to randomArrKey function');
    }

    return Math.floor(Math.random() * arr.length);
  }
};
