const Bluebird = require('bluebird');
const Utils = require('./Utils');

module.exports = {
  KeywordRes: function (session = {}, clearCompleted) {
    return Object.assign({}, {
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
    });
  },

  FeelingRes: function (session = {}, nextAction) {
    if (!nextAction) {
      return Bluebird.reject(new Error('nextAction is required'));
    }

    return Object.assign({}, {
      sessionAttributes: Object.assign({}, session, {
        StressLevel: nextAction.StressLevel || null
      }),
      dialogAction: {
        type: 'ElicitSlot',
        intentName: nextAction.intentName,
        slots: nextAction.slots,
        slotToElicit: nextAction.slotToElicit
      }
    });
  },

  RdmDistRes: function (session = {}, nextAction, ellicitMsg) {
    if (!nextAction) {
      return Bluebird.reject(new Error('nextAction is required'));
    }

    return Object.assign({}, {
      sessionAttributes: Object.assign({}, session, {
        completedDistractions: JSON.stringify(nextAction.clearCompleted ? [] : [ nextAction.intentName, ...Utils.returnArray(session.completedDistractions) ])
      }),
      dialogAction: Object.assign({
        type: 'ElicitSlot',
        intentName: nextAction.intentName,
        slots: nextAction.slots,
        slotToElicit: nextAction.slotToElicit
      }, this.genEllicitMsg(ellicitMsg))
    });
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
