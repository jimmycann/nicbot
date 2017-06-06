const MainFixture = require('../fixtures/MainFixture');

const MainService = require('../../service/MainService');
const MessengerService = require('../../service/MessengerService');

const Bluebird = require('bluebird');
const sinon = require('sinon');
const faker = require('faker');

let sandbox;

describe('#MainService', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Params Validation', () => {
    it('should fail if the trigger is undefined', () => {
      return MainService.sendStatements(undefined, faker.random.number).should.be.rejectedWith('trigger or userId was not supplied');
    });

    it('should fail if the userId is undefined', () => {
      return MainService.sendStatements(MainFixture.newTrigger(), undefined).should.be.rejectedWith('trigger or userId was not supplied');
    });
  });

  describe('#Business Logic', () => {
    it('should call sendMessage for each message in the trigger (1 message)', () => {
      const trigger = MainFixture.newTrigger();
      const userId = faker.random.number();

      sandbox.stub(MessengerService, 'sendMessage').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MainService.sendStatements(trigger, userId))
        .then(response => {
          expect(MessengerService.sendMessage.calledOnce).to.equal(true);
        });
    });

    it('should call sendMessage for each message in the trigger (4 messages)', () => {
      const trigger = MainFixture.newTrigger({
        messages: [
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence()
        ]
      });
      const userId = faker.random.number();

      sandbox.stub(MessengerService, 'sendMessage').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MainService.sendStatements(trigger, userId))
        .then(response => {
          expect(MessengerService.sendMessage.callCount).to.equal(4);
        });
    });

    it('should call sendMessage zero times if there are no messages in the list', () => {
      const trigger = MainFixture.newTrigger({
        messages: []
      });
      const userId = faker.random.number();

      sandbox.stub(MessengerService, 'sendMessage').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MainService.sendStatements(trigger, userId))
        .then(response => {
          expect(MessengerService.sendMessage.notCalled).to.equal(true);
        });
    });

    it('should call sendMessage zero times if messages in the list are null', () => {
      const trigger = MainFixture.newTrigger({
        messages: null
      });
      const userId = faker.random.number();

      sandbox.stub(MessengerService, 'sendMessage').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });

      return Bluebird.resolve()
        .then(() => MainService.sendStatements(trigger, userId))
        .then(response => {
          expect(MessengerService.sendMessage.notCalled).to.equal(true);
        });
    });
  });
});
