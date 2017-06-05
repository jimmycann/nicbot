const faker = require('faker');
const Joi = require('joi');
const Schema = require('../../service/Schema');

const RES_SCHEMA = Joi.object().keys({
  sessionAttributes: Joi.object().keys({
    completedDistractions: Joi.array().items(Joi.string().allow(null)).min(0)
  }).required(),
  dialogAction: Joi.object().keys({
    type: Joi.string().required(),
    intentName: Joi.string().required(),
    slots: Joi.object().required(),
    slotToElicit: Joi.string().required()
  }).required()
});

module.exports = {
  newDistractionObj: function (payload) {
    const slotToElicit = faker.random.word();

    return Object.assign({}, {
      intentName: faker.random.word(),
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

  newCompletedArray: function (payload = []) {
    return [ ...payload, faker.random.word(), faker.random.word() ];
  },

  validate: function (payload, context = {}) {
    return Schema.validate(RES_SCHEMA, payload, context);
  }
};
