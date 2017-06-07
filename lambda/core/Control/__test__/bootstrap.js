const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');
chai.use(chaiAsPromised);

global.sinon = require('sinon');
global.expect = chai.expect;
global.should = chai.should();
global.Promise = require('../service/Bluebird');
