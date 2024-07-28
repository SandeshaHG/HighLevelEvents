const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");

router.get("/", (req, res) => {
  res.send("Get ready to book an appointment with Dr John");
});

const config = require("../config");
router.get("/config", (req, res) => {
  res.json({
    startHours: config.START_HOURS,
    endHours: config.END_HOURS,
    duration: config.DURATION,
    timezone: config.TIMEZONE,
  });
});

const getConfigUTC = (date) => {
  const timezone = config.TIMEZONE;
  const startDateString = `${date}T${config.START_HOURS}:00`;
  const endDateString = `${date}T${config.END_HOURS}:00`;

  const startDateInTimezone = moment.tz(startDateString, timezone);
  const endDateInTimezone = moment.tz(endDateString, timezone);

  return [startDateInTimezone, endDateInTimezone];
};

const userTimeZone = (date, timezone) => {
  const utcDate = moment.utc(date);
  return utcDate.tz(timezone).format();
};

const getSlots = (date, timezone) => {
  const slotDuration = config.DURATION;
  const durationMinutes = slotDuration * 60;

  const [userStartDate, userEndDate] = getConfigUTC(date);

  const slots = [];
  let current = moment(userStartDate);

  while (current < userEndDate) {
    slots.push(userTimeZone(current, timezone));
    current.add(durationMinutes, "minutes");
  }

  return slots;
};

router.get("/free_slots", (req, res) => {
  const { date, timezone } = req.query;

  const slots = getSlots(date, timezone);

  res.json({
    slots: slots,
  });
});

module.exports = router;
