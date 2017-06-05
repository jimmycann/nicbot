const Bluebird = require('bluebird');
const Utils = require('./Utils');

module.exports = {
  buildResponse: function (session, nextAction) {
    if (!nextAction) {
      return Bluebird.reject(new Error('nextAction is required'));
    }

    return JSON.stringify({
      sessionAttributes: Object.assign({}, session || {}, {
        completedDistractions: nextAction.clearCompleted ? [] : [ nextAction.intentName, ...Utils.returnArray(session.completedDistractions) ]
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
