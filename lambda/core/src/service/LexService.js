const Bluebird = require('bluebird');
const Utils = require('./Utils');

module.exports = {
  MainBranchRes: function (session = {}, clearCompleted = false) {
    return Bluebird.resolve(Object.assign({}, {
      sessionAttributes: Object.assign({}, session, {
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
    }));
  },

  NextActionRes: function (event, nextAction, ellicitMsg) {
    if (!nextAction) {
      return Bluebird.reject(new Error('nextAction is required'));
    }

    const session = event.sessionAttributes || {};

    return Bluebird.resolve(Object.assign({}, {
      sessionAttributes: Object.assign({}, session, {
        completedDistractions: JSON.stringify(nextAction.clearCompleted ? [] : [ nextAction.intentName, ...Utils.returnArray(session.completedDistractions) ]),
        StressLevel: event.currentIntent.slots.StressLevel || session.StressLevel || null
      }),
      dialogAction: Object.assign({
        type: 'ElicitSlot',
        intentName: nextAction.intentName,
        slots: Utils.isJson(nextAction.slots),
        slotToElicit: nextAction.slotToElicit
      }, this.genEllicitMsg(ellicitMsg))
    }));
  },

  genEllicitMsg: function (ellicitMsg) {
    if (!ellicitMsg) {
      return {};
    }

    return {
      message: {
        content: `${ellicitMsg}`,
        contentType: 'PlainText'
      }
    };
  }
};
