const MainFixture = require('../../fixtures/MainFixture');

const MainService = require('../../../service/MainService');
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

  describe('#Params Validation', () => {
    it('should fail if the userId is undefined', () => {
      return MainService.sendStatements(MainFixture.newTrigger(), undefined).should.be.rejectedWith('userId was not supplied');
    });
  });

  describe('#Business Logic', () => {
    it('should call sendMessages for each message in the trigger (1 message)', () => {
      const trigger = MainFixture.newTrigger();
      const userId = faker.random.number();

      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MainService.sendStatements(trigger.messages, userId))
        .then(response => {
          expect(MessengerService.sendMessages.calledOnce).to.equal(true);
        });
    });

    it('should call sendMessages for each message in the trigger (4 messages)', () => {
      const trigger = MainFixture.newTrigger({
        messages: [
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence()
        ]
      });
      const userId = faker.random.number();

      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MainService.sendStatements(trigger.messages, userId))
        .then(response => {
          expect(MessengerService.sendMessages.callCount).to.equal(4);
        });
    });

    it('should call sendMessages zero times if there are no messages in the list', () => {
      const trigger = MainFixture.newTrigger({
        messages: []
      });
      const userId = faker.random.number();

      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MainService.sendStatements(trigger.messages, userId))
        .then(response => {
          expect(MessengerService.sendMessages.notCalled).to.equal(true);
        });
    });

    it('should call sendMessages zero times if messages in the list are null', () => {
      const trigger = MainFixture.newTrigger({
        messages: null
      });
      const userId = faker.random.number();

      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MainService.sendStatements(trigger.messages, userId))
        .then(response => {
          expect(MessengerService.sendMessages.notCalled).to.equal(true);
        });
    });
  });
});
