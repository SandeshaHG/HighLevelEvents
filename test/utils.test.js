const assert = require("assert");
const moment = require("moment-timezone");

describe("Utils", function () {
  let { getConfigUTC, getSlots, userTimeZone } = require("../utils/utils");
  it("should return correct UTC start and end dates", function () {
    const date = "2024-07-29";
    const [startDateInTimezone, endDateInTimezone] = getConfigUTC(date);

    const expectedStartDateUTC = moment
      .tz(`${date}T09:00:00`, "America/Los_Angeles")
      .utc()
      .format();

    const expectedEndDateUTC = moment
      .tz(`${date}T17:00:00`, "America/Los_Angeles")
      .utc()
      .format();

    assert.strictEqual(
      startDateInTimezone.utc().format(),
      expectedStartDateUTC
    );
    assert.strictEqual(endDateInTimezone.utc().format(), expectedEndDateUTC);
  });

  it("userTimeZone - with config timezone", function () {
    const date = "2024-09-02T16:00:00Z";
    const timezone = "America/Los_Angeles";
    const expected = "2024-09-02T09:00:00-07:00";

    const result = userTimeZone(date, timezone);
    assert.strictEqual(result, expected);
  });

  it("userTimeZone - with different timezone", function () {
    const date = "2024-09-02T16:00:00Z";
    const timezone = "Europe/London";
    const expected = "2024-09-02T17:00:00+01:00";

    const result = userTimeZone(date, timezone);
    assert.strictEqual(result, expected);
  });
});
