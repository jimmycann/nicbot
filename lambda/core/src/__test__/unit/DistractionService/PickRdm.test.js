const LexFixture = require('../../fixtures/LexFixture');

const DistractionService = require('../../../service/DistractionService');
const DynamoService = require('../../../service/DynamoService');

const Bluebird = require('bluebird');
const sinon = require('sinon');
const faker = require('faker');

let sandbox;

describe('#MainService.sendStatements', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Params Validation', () => {
    it('should fail the `event` param is undefined', () => {
      return DistractionService.pickRdm(undefined).should.be.rejectedWith('event was not supplied');
    });
  });

  describe('#Business Logic', () => {
    it('should fail when DynamoService.findAllDistractions returns no distractions', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findAllDistractions').resolves(null);

      return DistractionService.pickRdm(event).should.be.rejectedWith('No distractions were found');
    });

    it('should fail when DynamoService.findAllDistractions returns empty distractions array', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findAllDistractions').resolves([]);

      return DistractionService.pickRdm(event).should.be.rejectedWith('No distractions were found');
    });

    it('should fail when DynamoService.findAllDistractions returns a non-array (number)', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findAllDistractions').resolves(1);

      return DistractionService.pickRdm(event).should.be.rejectedWith('No distractions were found');
    });

    it('should fail when DynamoService.findAllDistractions returns a non-array (boolean)', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findAllDistractions').resolves(true);

      return DistractionService.pickRdm(event).should.be.rejectedWith('No distractions were found');
    });

    it('should fail when DynamoService.findAllDistractions returns a non-array (string)', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findAllDistractions').resolves('invalid response');

      return DistractionService.pickRdm(event).should.be.rejectedWith('No distractions were found');
    });

    it('should fail when DynamoService.findAllDistractions returns a non-array (object)', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findAllDistractions').resolves(LexFixture.newDistractionObj());

      return DistractionService.pickRdm(event).should.be.rejectedWith('No distractions were found');
    });

    it('should call findNext once when a valid distractions array is returned', () => {
      const event = LexFixture.newEventObj();

      sandbox.stub(DynamoService, 'findAllDistractions').resolves([
        LexFixture.newDistractionObj(),
        LexFixture.newDistractionObj()
      ]);
      sandbox.stub(DistractionService, 'findNext').resolves({});

      return Bluebird.resolve()
        .then(() => DistractionService.pickRdm(event))
        .then(result => {
          expect(DistractionService.findNext.calledOnce).to.equal(true);
        });
    });
  });
});
