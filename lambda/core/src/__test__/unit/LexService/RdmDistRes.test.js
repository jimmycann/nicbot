const LexFixture = require('../../fixtures/LexFixture');

const LexService = require('../../../service/LexService');
const sinon = require('sinon');
const Bluebird = require('bluebird');

let sandbox;

describe('#LexService', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Params Validation', () => {
    it('should fail if the nextAction is null', () => {
      return LexService.RdmDistRes('', null).should.be.rejectedWith('nextAction is required');
    });

    it('should succeed with a null ellicitMsg param', () => {
      const nextAction = LexFixture.newDistractionObj();

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(undefined, nextAction, null))
        .then(res => LexFixture.validate(res));
    });
  });

  describe('#Business Logic', () => {
    it('should succeed and return a valid response object', () => {
      const session = {
        completedDistractions: JSON.stringify(LexFixture.newCompletedArray())
      };
      const nextAction = LexFixture.newDistractionObj();

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(session, nextAction))
        .then(res => LexFixture.validate(res));
    });

    it('should return the correct properties for sessionAttributes', () => {
      const session = {
        completedDistractions: '[]'
      };
      const nextAction = LexFixture.newDistractionObj();

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(session, nextAction))
        .then(res => {
          expect(JSON.parse(res.sessionAttributes.completedDistractions).length).to.equal(1);
          expect(res.sessionAttributes.completedDistractions.includes(nextAction.intentName)).to.equal(true);
        });
    });

    it('should return the correct properties for dialogAction', () => {
      const session = {
        completedDistractions: '[]'
      };
      const nextAction = LexFixture.newDistractionObj();

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(session, nextAction))
        .then(res => {
          expect(res.dialogAction.type).to.equal('ElicitSlot');
          expect(res.dialogAction.intentName).to.equal(nextAction.intentName);
          expect(res.dialogAction.slots).to.eql(nextAction.slots);
          expect(res.dialogAction.slotToElicit).to.equal(nextAction.slotToElicit);
        });
    });

    it('should return an empty array in completedDistractions if clearCompleted is true', () => {
      const session = {
        completedDistractions: '[]'
      };
      const nextAction = LexFixture.newDistractionObj({ clearCompleted: true });

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(session, nextAction))
        .then(res => {
          expect(JSON.parse(res.sessionAttributes.completedDistractions)).to.eql([]);
        });
    });

    it('should return an object with dialogAction.message omitted when ellicitMsg is not supplied', () => {
      const session = {};
      const nextAction = LexFixture.newDistractionObj();

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(session, nextAction))
        .then(res => {
          expect(res.dialogAction.message).to.eql(undefined);
        });
    });

    it('should return a valid response object including `messages` when ellicitMsg is set', () => {
      const session = {};
      const nextAction = LexFixture.newDistractionObj();
      const ellicitMsg = 'This message should be in the response body';

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(session, nextAction, ellicitMsg))
        .then(res => {
          expect(res.dialogAction.message).to.eql({
            content: 'This message should be in the response body',
            contentType: 'PlainText'
          });
          return LexFixture.validate(res);
        });
    });
  });
});
