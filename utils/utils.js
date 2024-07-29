const config = require("../config");
const moment = require("moment-timezone");

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

const getSlots = (date, timezone, existingSlots = []) => {
  const slotDuration = config.DURATION;
  const durationMinutes = slotDuration * 60;

  const [userStartDate, userEndDate] = getConfigUTC(date);

  const slots = [];
  let current = moment(userStartDate);

  while (current < userEndDate) {
    const currentEnd = moment(current).add(durationMinutes, "minutes");
    const isBooked = existingSlots.some((slot) => {
      const slotStart = moment(slot.timestamp);
      const slotEnd = moment(slot.timestamp).add(slot.duration, "minutes");

      return (
        current.isBetween(slotStart, slotEnd, null, "[)") ||
        currentEnd.isBetween(slotStart, slotEnd, null, "(]")
      );
    });

    if (!isBooked) {
      slots.push(current.tz(timezone).format("YYYY-MM-DD HH:mm"));
    }
    current.add(durationMinutes, "minutes");
  }

  return slots;
};

module.exports = { getConfigUTC, getSlots, userTimeZone };
