const LexService = require('../../../service/LexService');
const sinon = require('sinon');
const Bluebird = require('bluebird');

let sandbox;

describe('#LexService.genEllicitMsg', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Business Logic', () => {
    it('should return an empty object when no ellicitMsg is supplied', () => {
      return Bluebird.resolve()
        .then(() => LexService.genEllicitMsg(null))
        .then(res => expect(res).to.eql({}));
    });

    it('should return a valid Lex response format message when ellicitMsgis supplied', () => {
      const ellicitMsg = 'this message should work';

      return Bluebird.resolve()
        .then(() => LexService.genEllicitMsg(ellicitMsg))
        .then(res => expect(res).to.eql({
          message: {
            content: `${ellicitMsg}`,
            contentType: 'PlainText'
          }
        }));
    });
  });
});
