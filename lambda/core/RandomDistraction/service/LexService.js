const Bluebird = require('bluebird');
const Utils = require('./Utils');

module.exports = {
  buildResponse: function (session, nextAction) {
    if (!nextAction) {
      return Bluebird.reject(new Error('nextAction is required'));
    }

    return JSON.stringify({
      sessionAttributes: Object.assign({}, session || {}, {
        completedDistractions: [ nextAction.intent, ...Utils.returnArray(session.distractions) ]
      }),
      dialogAction: {
        type: 'ElicitSlot',
        intentName: nextAction.intent,
        slots: nextAction.slots,
        slotToElicit: nextAction.ellicitSlot
      }
    });
  }
};
