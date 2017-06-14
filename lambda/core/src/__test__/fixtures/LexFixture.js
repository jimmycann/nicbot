const faker = require('faker');
const Joi = require('joi');
const _ = require('lodash');

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
  newCurrentIntentObj: function (payload) {
    const slotToElicit = faker.random.word();

    return Object.assign({}, {
      intentName: faker.random.word(),
      slots: this.newSlotsObj(slotToElicit)
    }, payload);
  },

  newEventObj: function (payload, omissions = []) {
    return _.omit(Object.assign({}, {
      messageVersion: '1.0',
      invocationSource: 'FulfillmentCodeHook',
      userId: faker.random.uuid(),
      sessionAttributes: {
        Price: 25
      },
      bot: {
        name: 'nicbot',
        alias: null,
        version: '$LATEST'
      },
      outputDialogMode: 'Text',
      currentIntent: this.newCurrentIntentObj(),
      confirmationStatus: 'Confirmed'
    }, payload), ...omissions);
  },

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
