const MainFixture = require('../../fixtures/MainFixture');

const DistractionService = require('../../../service/DistractionService');

const Bluebird = require('bluebird');
const sinon = require('sinon');
const faker = require('faker');

let sandbox;

describe('#MainService.sendStatements', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => (sandbox.restore()));

  describe('#Business Logic', () => {
    it('should return completedDistractions as a JS object from JSON string', () => {
      const sessionAttributes = {
        completedDistractions: JSON.stringify(MainFixture.newCompletedArray())
      };

      return Bluebird.resolve()
        .then(() => DistractionService.returnCompleted(sessionAttributes))
        .then(response => {
          expect(response).not.to.eql(sessionAttributes.completedDistractions);
          expect(response).to.eql(JSON.parse(sessionAttributes.completedDistractions));
        });
    });

    it('should return completedDistractions as a JS object from original JS object', () => {
      const sessionAttributes = {
        completedDistractions: MainFixture.newCompletedArray()
      };

      return Bluebird.resolve()
        .then(() => DistractionService.returnCompleted(sessionAttributes))
        .then(response => {
          expect(response).to.eql(sessionAttributes.completedDistractions);
        });
    });

    it('should return completedDistractions as an empty array when completed distractions is undefined', () => {
      const sessionAttributes = {
        completedDistractions: undefined
      };

      return Bluebird.resolve()
        .then(() => DistractionService.returnCompleted(sessionAttributes))
        .then(response => {
          expect(response).to.eql([]);
        });
    });

    it('should return completedDistractions as an empty array when completed distractions is omitted', () => {
      const sessionAttributes = {};

      return Bluebird.resolve()
        .then(() => DistractionService.returnCompleted(sessionAttributes))
        .then(response => {
          expect(response).to.eql([]);
        });
    });

    it('should return completedDistractions as an empty array when sessionAttributes is undefined', () => {
      const sessionAttributes = undefined;

      return Bluebird.resolve()
        .then(() => DistractionService.returnCompleted(sessionAttributes))
        .then(response => {
          expect(response).to.eql([]);
        });
    });
  });
});
