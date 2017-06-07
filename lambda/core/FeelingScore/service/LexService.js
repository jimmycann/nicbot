const Bluebird = require('bluebird');

module.exports = {
  buildResponse: function (session, nextAction) {
    if (!nextAction) {
      return Bluebird.reject(new Error('nextAction is required'));
    }

    return Object.assign({}, {
      sessionAttributes: Object.assign({}, session || {}, {
        StressLevel: nextAction.StressLevel || null
      }),
      dialogAction: {
        type: 'ElicitSlot',
        intentName: nextAction.intentName,
        slots: nextAction.slots,
        slotToElicit: nextAction.slotToElicit
      }
    });
  }
};
