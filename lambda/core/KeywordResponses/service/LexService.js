module.exports = {
  buildResponse: function (session, clearCompleted) {
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
