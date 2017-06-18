'use strict';

module.exports = {
  returnArray: function (data) {
    const testArr = this.isJson(data);
    if (!testArr) {
      return [];
    }

    if (!Array.isArray(testArr)) {
      return [ testArr ];
    }

    return testArr;
  },

  isJson: function (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  },

  rdmKey: function (arr) {
    if (!Array.isArray(arr)) {
      throw new Error('Array must be passed to randomArrKey function');
    }

    return Math.floor(Math.random() * arr.length);
  }
};
