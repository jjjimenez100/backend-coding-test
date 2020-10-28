class DummyResponse {
  constructor() { }
  status(code = 200) {
    this.code = code;
    return this;
  }
  send(body = {}) {
    this.body = body;
    return this;
  }
}

module.exports = DummyResponse;