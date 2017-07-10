const LexFixture = require('../../fixtures/LexFixture');
const DynamoFixture = require('../../fixtures/DynamoFixture');

const LexService = require('../../../service/LexService');
const DynamoService = require('../../../service/DynamoService');
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
      sandbox.stub(DynamoService, 'findDynamic').resolves(DynamoFixture.dynamicMessage());

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

      sandbox.stub(DynamoService, 'findDynamic').resolves(DynamoFixture.dynamicMessage());

      return Bluebird.resolve()
        .then(() => LexService.MainBranchRes(session))
        .then(res => LexFixture.validate(res));
    });

    it('should return an empty array when clearCompleted is set true', () => {
      const session = {
        completedDistractions: JSON.stringify(LexFixture.newCompletedArray())
      };
      const clearCompleted = true;

      sandbox.stub(DynamoService, 'findDynamic').resolves(DynamoFixture.dynamicMessage());

      return Bluebird.resolve()
        .then(() => LexService.MainBranchRes(session, clearCompleted))
        .then(res => {
          expect(res.sessionAttributes.completedDistractions).to.equal('[]');
        });
    });

    it('should return a message to ellcit when generating the response', () => {
      const session = {
        completedDistractions: JSON.stringify(LexFixture.newCompletedArray())
      };
      const clearCompleted = true;
      const DynamicMsgs = DynamoFixture.dynamicMessage();
      sandbox.stub(DynamoService, 'findDynamic').resolves(DynamicMsgs);

      return Bluebird.resolve()
        .then(() => LexService.MainBranchRes(session, clearCompleted))
        .then(res => {
          expect(res.dialogAction.message.contentType).to.equal('PlainText');
          expect(JSON.parse(DynamicMsgs.messages).includes(res.dialogAction.message.content)).to.equal(true);
        });
    });
  });
});
