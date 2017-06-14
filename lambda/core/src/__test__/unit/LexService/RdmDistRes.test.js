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
  });

  describe('#Business Logic', () => {
    it('should succeed and return a valid response object', () => {
      const session = {
        completedDistractions: LexFixture.newCompletedArray()
      };
      const nextAction = LexFixture.newDistractionObj();

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(session, nextAction))
        .then(res => LexFixture.validate(res));
    });

    it('should return the correct properties for sessionAttributes', () => {
      const session = {
        completedDistractions: []
      };
      const nextAction = LexFixture.newDistractionObj();

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(session, nextAction))
        .then(res => {
          expect(res.sessionAttributes.completedDistractions.length).to.equal(1);
          expect(res.sessionAttributes.completedDistractions.includes(nextAction.intentName)).to.equal(true);
        });
    });

    it('should return the correct properties for dialogAction', () => {
      const session = {
        completedDistractions: []
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
        completedDistractions: []
      };
      const nextAction = LexFixture.newDistractionObj({ clearCompleted: true });

      return Bluebird.resolve()
        .then(() => LexService.RdmDistRes(session, nextAction))
        .then(res => {
          expect(res.sessionAttributes.completedDistractions).to.eql([]);
        });
    });
  });
});
