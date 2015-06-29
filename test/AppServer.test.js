var AppServer = require('../lib/AppServer');
var assert = require('assert');

describe('AppServer', function() {
  it('should be callable', function() {
    assert.equal(typeof AppServer, 'function');
  });
});