const faker = require('faker');
const _ = require('lodash');

module.exports = {
  dynamicMessage: function (payload) {
    return Object.assign({}, {
      situation: faker.random.word(),
      messages: JSON.stringify([
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence()
      ])
    }, payload);
  }
};
