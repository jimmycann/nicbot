const DynamoFixture = require('../../fixtures/DynamoFixture');
const LexFixture = require('../../fixtures/LexFixture');

const TwoPlusService = require('../../../service/TwoPlusService');
const MessengerService = require('../../../service/MessengerService');

const Bluebird = require('bluebird');
const sinon = require('sinon');

let sandbox;

describe('#TwoPlusService.pickAndSend', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Params Validation', () => {
    it('should fail if the event param is undefined', () => {
      return TwoPlusService.pickAndSend(undefined, {}).should.be.rejectedWith('event or data was not supplied');
    });

    it('should fail if the data param is undefined', () => {
      return TwoPlusService.pickAndSend({}, undefined).should.be.rejectedWith('event or data was not supplied');
    });

    it('should fail if the messages prop is 0 length', () => {
      return TwoPlusService.pickAndSend({}, { messages: '[]' }).should.be.rejectedWith('messages is not an array or undefined', []);
    });
  });

  describe('#Business Logic', () => {
    it('should succeed and call sendMsgArray the appropriate amount of times', () => {
      const event = LexFixture.newEventObj();
      const data = DynamoFixture.levelTwo();

      sandbox.stub(MessengerService, 'sendMsgArray').resolves({});

      return Bluebird.resolve()
        .then(() => TwoPlusService.pickAndSend(event, data))
        .then(response => {
          expect(MessengerService.sendMsgArray.callCount).to.equal(1);
          expect(response).to.eql(data);
        });
    });
  });
});
