const { errorHandler } = require('../src/lib/errorHandler');
const assert = require('assert');
const DummyResponse = require('./DummyResponse');

describe('Custom error handler test', () => {
  it('should call DummyResponse with status code of 500 and server error' +
      ' message', (done) => {
    const error = new Error('This is a test error');
    const response = new DummyResponse();
    errorHandler(error, null, response);
    assert.strictEqual(response.code, 500);
    assert.strictEqual(response.body.error_code, 'SERVER_ERROR');
    assert.strictEqual(response.body.message, 'Unknown error');
    done();
  });
});