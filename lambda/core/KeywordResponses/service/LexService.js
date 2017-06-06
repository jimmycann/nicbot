const Bluebird = require('bluebird');

module.exports = {
  buildResponse: function (session, clearCompleted) {
    if (!session) {
      return Bluebird.reject(new Error('session was not supplied'));
    }

    return Object.assign({}, {
      sessionAttributes: Object.assign({}, session || {}, {
        completedDistractions: clearCompleted ? [] : session.completedDistractions
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
  }
};
