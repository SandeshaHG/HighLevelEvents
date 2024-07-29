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

  it("Should return the right slots", function () {
    const date = "2024-09-02";
    const timezone = "America/New_York";
    const slots = getSlots(date, timezone);
    const expectedSlots = [
      "2024-09-02T12:00:00-04:00",
      "2024-09-02T12:30:00-04:00",
      "2024-09-02T13:00:00-04:00",
      "2024-09-02T13:30:00-04:00",
      "2024-09-02T14:00:00-04:00",
      "2024-09-02T14:30:00-04:00",
      "2024-09-02T15:00:00-04:00",
      "2024-09-02T15:30:00-04:00",
      "2024-09-02T16:00:00-04:00",
      "2024-09-02T16:30:00-04:00",
      "2024-09-02T17:00:00-04:00",
      "2024-09-02T17:30:00-04:00",
      "2024-09-02T18:00:00-04:00",
      "2024-09-02T18:30:00-04:00",
      "2024-09-02T19:00:00-04:00",
      "2024-09-02T19:30:00-04:00",
    ];
    console.log(slots);

    assert.deepStrictEqual(slots, expectedSlots);
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
