const faker = require('faker');
const Joi = require('joi');
const _ = require('lodash');

const Schema = require('../../service/Schema');

const RES_SCHEMA = Joi.object().keys({
  intentName: Joi.string().required(),
  intentKey: Joi.string(),
  slots: Joi.object().required(),
  slotToElicit: Joi.string().required(),
  clearCompleted: Joi.boolean().allow(null)
});

module.exports = {
  newEllicitObj: function (payload) {
    const slotToElicit = faker.random.word();

    return Object.assign({}, {
      intentName: faker.random.word(),
      slots: this.newSlotsObj(slotToElicit),
      slotToElicit: slotToElicit
    }, payload);
  },

  newDistractionObj: function (payload) {
    const slotToElicit = faker.random.word();

    return Object.assign({}, {
      intentName: 'randomDistraction',
      intentKey: faker.random.word(),
      slots: this.newSlotsObj(slotToElicit),
      slotToElicit: slotToElicit
    }, payload);
  },

  newSlotsObj: function (slotToElicit) {
    return Object.assign({}, {
      [slotToElicit]: null,
      [faker.random.word()]: null,
      [faker.random.word()]: null,
      [faker.random.word()]: null
    });
  },

  newFeelingObj: function (payload, omissions = []) {
    return _.omit(Object.assign({}, {
      level: faker.random.number().toString(),
      messages: this.newMessagesArray(),
      nextIntent: this.newEllicitObj()
    }, payload), ...omissions);
  },

  newCompletedArray: function (payload = []) {
    return [ ...payload, faker.random.word(), faker.random.word() ];
  },

  newMessagesArray: function (payload = []) {
    return [ ...payload, faker.random.word(), faker.random.word() ];
  },

  newTrigger: function (payload) {
    return Object.assign({}, {
      intentName: faker.random.word(),
      messages: [ faker.lorem.sentence() ]
    }, payload);
  },

  validate: function (payload, context = {}) {
    return Schema.validate(RES_SCHEMA, payload, context);
  }
};
