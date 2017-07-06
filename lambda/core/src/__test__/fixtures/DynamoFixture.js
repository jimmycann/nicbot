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
  },

  levelTwo: function (payload) {
    return Object.assign({}, {
      level: '2',
      intentName: 'levelTwo',
      messages: JSON.stringify([
        [ faker.lorem.sentence(), faker.lorem.sentence() ],
        [ faker.lorem.sentence(), faker.lorem.sentence() ],
        [ faker.lorem.sentence(), faker.lorem.sentence() ],
        [ faker.lorem.sentence(), faker.lorem.sentence() ]
      ]),
      ellicitMsg: faker.lorem.sentence(),
      slots: '{ "levelTwo": null }',
      slotToElicit: 'levelTwo'
    }, payload);
  }
};
