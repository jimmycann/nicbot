const Bluebird = require('bluebird');
const Utils = require('./Utils');

module.exports = {
  findNextAction: function (session, distractions) {
    const completed = Utils.returnArray(session.completedDistractions);

    return this.removeCompleted(completed, distractions)
      .then(distMap => {
        if (!distMap || distMap.length === 0) {
          return Object.assign({}, distractions[Utils.rdmKey(distractions)], {
            clearCompleted: true
          });
        }

        return Object.assign({}, distMap[Utils.rdmKey(distMap)]);
      });
  },

  removeCompleted: function (completed, distractions) {
    return Bluebird.filter(Utils.returnArray(distractions), (distraction) => {
      if (!completed.includes(distraction.intentName)) {
        return distraction;
      }
    });
  }
};
