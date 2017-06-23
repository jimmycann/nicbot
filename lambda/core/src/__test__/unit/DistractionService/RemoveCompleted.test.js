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

  describe('#Params Validation', () => {
    it('should fail if the removeCompleted distractions param is undefined', () => {
      return DistractionService.removeCompleted([], undefined).should.be.rejectedWith('No distractions were found');
    });

    it('should fail if the removeCompleted distractions param is an empty array', () => {
      return DistractionService.removeCompleted([], []).should.be.rejectedWith('No distractions were found');
    });

    it('should fail if the removeCompleted distractions param is a string', () => {
      return DistractionService.removeCompleted([], 'thinkMusic').should.be.rejectedWith('No distractions were found');
    });

    it('should fail if the removeCompleted distractions param is a number', () => {
      return DistractionService.removeCompleted([], 234).should.be.rejectedWith('No distractions were found');
    });

    it('should fail if the removeCompleted distractions param is an object', () => {
      return DistractionService.removeCompleted([], {}).should.be.rejectedWith('No distractions were found');
    });
  });

  describe('#Business Logic', () => {
    it('should return all distractions when completedDistractions is empty', () => {
      const completed = [];
      const distractions = [
        MainFixture.newDistractionObj(),
        MainFixture.newDistractionObj()
      ];

      return Bluebird.resolve()
        .then(() => DistractionService.removeCompleted(completed, distractions))
        .then(response => {
          expect(response).to.eql(distractions);
        });
    });

    it('should return all remove a single completed distraction', () => {
      const distractionName = faker.random.word();
      const completed = [ distractionName ];
      const distractions = [
        MainFixture.newDistractionObj({ intentName: distractionName }),
        MainFixture.newDistractionObj()
      ];

      return Bluebird.resolve()
        .then(() => DistractionService.removeCompleted(completed, distractions))
        .then(response => {
          expect(response).to.eql([ distractions[1] ]);
        });
    });

    it('should return the remaining distraction available', () => {
      const distractionName = [ faker.random.word(), faker.random.word() ];
      const completed = [ distractionName[0], distractionName[1] ];
      const distractions = [
        MainFixture.newDistractionObj({ intentName: distractionName[0] }),
        MainFixture.newDistractionObj({ intentName: distractionName[1] }),
        MainFixture.newDistractionObj()
      ];

      return Bluebird.resolve()
        .then(() => DistractionService.removeCompleted(completed, distractions))
        .then(response => {
          expect(response).to.eql([ distractions[2] ]);
        });
    });

    it('should return the remaining multiple distractions available', () => {
      const distractionName = [ faker.random.word(), faker.random.word() ];
      const completed = [ distractionName[0], distractionName[1] ];
      const distractions = [
        MainFixture.newDistractionObj({ intentName: distractionName[0] }),
        MainFixture.newDistractionObj(),
        MainFixture.newDistractionObj({ intentName: distractionName[1] }),
        MainFixture.newDistractionObj()
      ];

      return Bluebird.resolve()
        .then(() => DistractionService.removeCompleted(completed, distractions))
        .then(response => {
          expect(response[0]).to.eql(distractions[1]);
          expect(response[1]).to.eql(distractions[3]);
        });
    });
  });
});
