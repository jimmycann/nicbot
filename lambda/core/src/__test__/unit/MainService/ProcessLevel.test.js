const MainFixture = require('../../fixtures/MainFixture');
const LexFixture = require('../../fixtures/LexFixture');

const MainService = require('../../../service/MainService');
const DynamoService = require('../../../service/DynamoService');
const DistractionService = require('../../../service/DistractionService');
const TwoPlusService = require('../../../service/TwoPlusService');
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
    it('should call pickRdm when level is \'1\'', () => {
      const event = LexFixture.newEventObj({ currentIntent: LexFixture.newCurrentIntentObj({ slots: { StressLevel: '1' } }) });

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj({}, ['messages']));
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});
      sandbox.stub(DistractionService, 'pickRdm').resolves({});
      sandbox.stub(TwoPlusService, 'pickAndSend').resolves({});
      sandbox.stub(TwoPlusService, 'emergency').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(DistractionService.pickRdm.callCount).to.equal(1);
          expect(TwoPlusService.pickAndSend.callCount).to.equal(0);
          expect(TwoPlusService.emergency.callCount).to.equal(0);
        });
    });

    it('should only call TwoPlusService.pickAndSend when level is \'2\'', () => {
      const event = LexFixture.newEventObj({ currentIntent: LexFixture.newCurrentIntentObj({ slots: { StressLevel: '2' } }) });

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj());
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});
      sandbox.stub(DistractionService, 'pickRdm').resolves({});
      sandbox.stub(TwoPlusService, 'pickAndSend').resolves({});
      sandbox.stub(TwoPlusService, 'emergency').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(DistractionService.pickRdm.callCount).to.equal(0);
          expect(TwoPlusService.pickAndSend.callCount).to.equal(1);
          expect(TwoPlusService.emergency.callCount).to.equal(0);
        });
    });

    it('should only call TwoPlusService.emergency when level is \'3\'', () => {
      const event = LexFixture.newEventObj({ currentIntent: LexFixture.newCurrentIntentObj({ slots: { StressLevel: '3' } }) });

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj());
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});
      sandbox.stub(DistractionService, 'pickRdm').resolves({});
      sandbox.stub(TwoPlusService, 'pickAndSend').resolves({});
      sandbox.stub(TwoPlusService, 'emergency').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(DistractionService.pickRdm.callCount).to.equal(0);
          expect(TwoPlusService.pickAndSend.callCount).to.equal(0);
          expect(TwoPlusService.emergency.callCount).to.equal(1);
        });
    });

    it('should fall back to sessionAttributes StressLevel when not defined in currentIntent.slots', () => {
      const event = LexFixture.newEventObj({ sessionAttributes: { StressLevel: '2' } });

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj());
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});
      sandbox.stub(DistractionService, 'pickRdm').resolves({});
      sandbox.stub(TwoPlusService, 'pickAndSend').resolves({});
      sandbox.stub(TwoPlusService, 'emergency').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(DistractionService.pickRdm.callCount).to.equal(0);
          expect(TwoPlusService.pickAndSend.callCount).to.equal(1);
          expect(TwoPlusService.emergency.callCount).to.equal(0);
        });
    });

    it('should default to level \'1\' when StressLevel is not sent', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findLevel').resolves(MainFixture.newFeelingObj());
      sandbox.stub(MessengerService, 'sendMessages').resolves({
        recipient_id: faker.random.number(),
        message_id: faker.random.uuid()
      });
      sandbox.stub(MessengerService, 'sendDynamic').resolves({});
      sandbox.stub(DistractionService, 'pickRdm').resolves({});
      sandbox.stub(TwoPlusService, 'pickAndSend').resolves({});
      sandbox.stub(TwoPlusService, 'emergency').resolves({});

      return Bluebird.resolve()
        .then(() => MainService.processLevel(event))
        .then(response => {
          expect(DistractionService.pickRdm.callCount).to.equal(1);
          expect(TwoPlusService.pickAndSend.callCount).to.equal(0);
          expect(TwoPlusService.emergency.callCount).to.equal(0);
        });
    });
  });
});
