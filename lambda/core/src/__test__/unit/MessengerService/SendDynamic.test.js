const DynamoFixture = require('../../fixtures/DynamoFixture');

const Utils = require('../../../service/Utils');
const DynamoService = require('../../../service/DynamoService');
const MessengerService = require('../../../service/MessengerService');

const Bluebird = require('bluebird');
const sinon = require('sinon');
const faker = require('faker');

let sandbox;

describe('#MainService.sendStatements', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Business Logic', () => {
    it('should call sendMessages successfully', () => {
      const type = 'encouragement';
      const userId = faker.random.number();

      sandbox.stub(DynamoService, 'findDynamic').resolves(DynamoFixture.dynamicMessage());
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MessengerService.sendDynamic(type, userId))
        .then(response => {
          expect(MessengerService.sendMessages.calledOnce).to.equal(true);
        });
    });

    it('should return without calling sendMessages when dynamic.messages returns empty array', () => {
      const type = 'encouragement';
      const userId = faker.random.number();

      sandbox.stub(DynamoService, 'findDynamic').resolves(DynamoFixture.dynamicMessage({ messages: JSON.stringify([]) }));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MessengerService.sendDynamic(type, userId))
        .then(response => {
          expect(MessengerService.sendMessages.calledOnce).to.equal(false);
        });
    });

    it('should return without calling sendMessages when dynamic returns undefined', () => {
      const type = 'encouragement';
      const userId = faker.random.number();

      sandbox.stub(DynamoService, 'findDynamic').resolves(null);
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MessengerService.sendDynamic(type, userId))
        .then(response => {
          expect(MessengerService.sendMessages.calledOnce).to.equal(false);
        });
    });

    it('should return without calling sendMessages when userId is undefined', () => {
      const type = 'encouragement';
      const userId = undefined;

      sandbox.stub(DynamoService, 'findDynamic').resolves(DynamoFixture.dynamicMessage({ messages: JSON.stringify([]) }));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MessengerService.sendDynamic(type, userId))
        .then(response => {
          expect(MessengerService.sendMessages.calledOnce).to.equal(false);
        });
    });

    it('should return without calling sendMessages when dynamic.messages returns as non-array', () => {
      const type = 'encouragement';
      const userId = faker.random.number();

      sandbox.stub(DynamoService, 'findDynamic').resolves(DynamoFixture.dynamicMessage({ messages: {} }));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MessengerService.sendDynamic(type, userId))
        .then(response => {
          expect(MessengerService.sendMessages.calledOnce).to.equal(false);
        });
    });

    it('should call sendMessages once successfully even if dynamic.messages is not a JSON string', () => {
      const type = 'encouragement';
      const userId = faker.random.number();

      sandbox.stub(DynamoService, 'findDynamic').resolves(DynamoFixture.dynamicMessage({ messages: [ faker.lorem.sentence(), faker.lorem.sentence() ] }));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MessengerService.sendDynamic(type, userId))
        .then(response => {
          expect(MessengerService.sendMessages.calledOnce).to.equal(true);
        });
    });
  });
});
