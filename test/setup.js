require('jest-fetch-mock').enableMocks();

const chrome = require('sinon-chrome');

window.chrome = chrome;
