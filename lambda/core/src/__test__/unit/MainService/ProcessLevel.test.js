const MainFixture = require('../../fixtures/MainFixture');
const LexFixture = require('../../fixtures/LexFixture');

const MainService = require('../../../service/MainService');
const DynamoService = require('../../../service/DynamoService');
const MessengerService = require('../../../service/MessengerService');

const Bluebird = require('bluebird');
const sinon = require('sinon');
const faker = require('faker');

let sandbox;

describe('#MainService.processLevel', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Params Validation', () => {
    it('should fail if the processLevel event param is undefined', () => {
      return MainService.processLevel(undefined).should.be.rejectedWith('event is required');
    });
  });

  describe('#Business Logic', () => {
    it('should succeed and call sendMessages the appropriate amount of times', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj());
      sandbox.stub(MessengerService, 'sendMessages').resolves([{
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      }]);
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(MessengerService.sendMessages.callCount).to.equal(2);
        });
    });

    it('should not call sendMessages when messages array is empty', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj({ messages: [] }));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(MessengerService.sendMessages.callCount).to.equal(0);
        });
    });

    it('should continue without throwing when messages is null', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj({ messages: null }));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(MessengerService.sendMessages.callCount).to.equal(0);
        });
    });

    it('should continue without throwing when messages is not an array (string)', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj({ messages: 'should be an array' }));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(MessengerService.sendMessages.callCount).to.equal(0);
        });
    });

    it('should continue without throwing when messages is not an array (object)', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj({ messages: {} }));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(MessengerService.sendMessages.callCount).to.equal(0);
        });
    });

    it('should continue without throwing when messages is omitted', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj({}, ['messages']));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(MessengerService.sendMessages.callCount).to.equal(0);
        });
    });
  });
});
