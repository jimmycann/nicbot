const LexFixture = require('../../fixtures/LexFixture');

const LexService = require('../../../service/LexService');
const sinon = require('sinon');
const Bluebird = require('bluebird');

let sandbox;

describe('#LexService.MainBranchRes', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Params Validation', () => {
    it('should succeed with an empty completedDistractions list ', () => {
      return Bluebird.resolve()
        .then(() => LexService.MainBranchRes(undefined))
        .then(res => {
          expect(res.sessionAttributes.completedDistractions).to.equal('[]');
          return LexFixture.validate(res);
        });
    });
  });

  describe('#Business Logic', () => {
    it('should succeed and return a valid response object', () => {
      const session = {
        completedDistractions: JSON.stringify(LexFixture.newCompletedArray())
      };

      return Bluebird.resolve()
        .then(() => LexService.MainBranchRes(session))
        .then(res => LexFixture.validate(res));
    });

    it('should return an empty array when clearCompleted is set true', () => {
      const session = {
        completedDistractions: JSON.stringify(LexFixture.newCompletedArray())
      };
      const clearCompleted = true;

      return Bluebird.resolve()
        .then(() => LexService.MainBranchRes(session, clearCompleted))
        .then(res => {
          expect(res.sessionAttributes.completedDistractions).to.equal('[]');
        });
    });
  });
});
