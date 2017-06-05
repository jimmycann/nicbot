const Bluebird = require('bluebird');
const Utils = require('./Utils');

module.exports = {
  findNextAction: function (session, distractions) {
    const completed = Utils.returnArray(session.distractions);

    return this.removeCompleted(completed, distractions)
      .then(distMap => distMap[Math.floor(Math.random() * distMap.length)]);
  },

  removeCompleted: function (completed, distractions) {
    return Bluebird.filter(distractions, (distraction) => {
      if (!completed.includes(distraction.intentName)) {
        return distraction;
      }
    });
  }
};
