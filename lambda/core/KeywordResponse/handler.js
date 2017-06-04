'use strict';

module.exports.KeywordResponse = (event, context, callback) => {
  console.log(event);

  return callback(null, JSON.stringify({
    dialogAction: {
      type: 'ElicitSlot',
      intentName: 'MainBranch',
      slots: {
        ReqLocation: null,
        StressLevel: null
      },
      slotToElicit: 'StressLevel'
    }
  }));
};
