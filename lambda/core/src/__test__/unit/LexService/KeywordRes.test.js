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
    it('should fail if the session is undefined', () => {
      return LexService.KeywordRes(undefined).should.be.rejectedWith('session was not supplied');
    });
  });

  describe('#Business Logic', () => {
    it('should succeed and return a valid response object', () => {
      const session = {
        completedDistractions: LexFixture.newCompletedArray()
      };

      return Bluebird.resolve()
        .then(() => LexService.KeywordRes(session))
        .then(res => LexFixture.validate(res));
    });

    it('should return an empty array when clearCompleted is set true', () => {
      const session = {
        completedDistractions: LexFixture.newCompletedArray()
      };
      const clearCompleted = true;

      return Bluebird.resolve()
        .then(() => LexService.KeywordRes(session, clearCompleted))
        .then(res => {
          expect(res.sessionAttributes.completedDistractions.length).to.equal(0);
        });
    });
  });
});
