const LexFixture = require('../fixtures/LexFixture');

const LexService = require('../../service/LexService');
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
      return LexService.buildResponse('', null).should.be.rejectedWith('nextAction is required');
    });
  });

  describe('#Business Logic', () => {
    // it('should succeed and return a valid response object', () => {
    //   const session = {
    //     completedDistractions: LexFixture.newCompletedArray()
    //   };
    //   const nextAction = LexFixture.newDistractionObj();
    //
    //   return Bluebird.resolve()
    //     .then(() => LexService.buildResponse(session, nextAction))
    //     .then(res => LexFixture.validate(res));
    // });
  });
});
