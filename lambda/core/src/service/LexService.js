const Bluebird = require('bluebird');
const Utils = require('./Utils');

module.exports = {
  KeywordRes: function (session, clearCompleted) {
    return Object.assign({}, {
      sessionAttributes: Object.assign({}, session || {}, {
        completedDistractions: JSON.stringify(clearCompleted ? [] : Utils.returnArray(session.completedDistractions))
      }),
      dialogAction: {
        type: 'ElicitSlot',
        intentName: 'MainBranch',
        slots: {
          ReqLocation: null,
          StressLevel: null
        },
        slotToElicit: 'StressLevel'
      }
    });
  },

  RdmDistRes: function (session, nextAction) {
    if (!nextAction) {
      return Bluebird.reject(new Error('nextAction is required'));
    }

    return Object.assign({}, {
      sessionAttributes: Object.assign({}, session || {}, {
        completedDistractions: JSON.stringify(nextAction.clearCompleted ? [] : [ nextAction.intentName, ...Utils.returnArray(session.completedDistractions) ])
      }),
      dialogAction: {
        type: 'ElicitSlot',
        intentName: nextAction.intentName,
        slots: nextAction.slots,
        slotToElicit: nextAction.slotToElicit
      }
    });
  },

  FeelingRes: function (session, nextAction) {
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
