const LexService = require('../../../service/LexService');
const sinon = require('sinon');

let sandbox;

describe('#LexService', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Params Validation', () => {
    it('should fail if the nextAction is null', () => {
      return LexService.FeelingRes('', null).should.be.rejectedWith('nextAction is required');
    });
  });
});
