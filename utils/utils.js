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

const slotExists = (current, existingSlots, slotDuration) => {
  const currentEnd = moment(current).add(slotDuration, "minutes");
  return existingSlots.some((slot) => {
    const slotStart = moment(slot.timestamp);
    const slotEnd = moment(slot.timestamp).add(slot.duration, "minutes");

    return (
      current.isBetween(slotStart, slotEnd, null, "[)") ||
      currentEnd.isBetween(slotStart, slotEnd, null, "(]")
    );
  });
};

const getSlots = (date, timezone, existingSlots = []) => {
  const slotDuration = config.DURATION;

  const [userStartDate, userEndDate] = getConfigUTC(date);

  const slots = [];
  let current = moment(userStartDate);

  while (current < userEndDate) {
    const isBooked = slotExists(current, existingSlots, slotDuration);

    if (!isBooked) {
      slots.push(current.tz(timezone).format("YYYY-MM-DD HH:mm"));
    }
    current.add(slotDuration, "minutes");
  }

  return slots;
};

const formattedDates = (data) => {
  return data.map((item) => {
    return {
      id: item.id,
      formattedTimestamps: item.timestamp.map((ts) => {
        const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1000000);
        return moment(date).format("YYYY-MM-DD h:mm A");
      }),
    };
  });
};

module.exports = {
  getConfigUTC,
  getSlots,
  userTimeZone,
  slotExists,
  formattedDates,
};
