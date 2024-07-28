const request = require("supertest");
const assert = require("assert");
const app = require("../index");
const config = require("../config");

describe("Init", function () {
  it("should be running and respond to requests", function (done) {
    request(app)
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(
          res.text,
          "Get ready to book an appointment with Dr John"
        );
        done();
      });
  });

  it("should return the right config", function (done) {
    request(app)
      .get("/config")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.duration, config.DURATION);
        assert.strictEqual(res.body.endHours, config.END_HOURS);
        assert.strictEqual(res.body.startHours, config.START_HOURS);
        assert.strictEqual(res.body.timezone, config.TIMEZONE);
        done();
      });
  });
});
