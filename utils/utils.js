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

const toMillis = (timestamp) => {
  return timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
};

const flattenSlots = (slots) => {
  return slots.flatMap((slot) => slot.timestamp?.map(toMillis));
};

const slotExists = (currentTimestamp, existingSlots, slotDuration = 30) => {
  const currentStart = moment(Number(currentTimestamp));
  const currentEnd = moment(Number(currentTimestamp)).add(
    slotDuration,
    "minutes"
  );
  const startHours = moment(config.Start_HOURS, "HH:mm");
  const endHours = moment(config.End_HOURS, "HH:mm");
  if (currentStart.isBefore(startHours) || currentEnd.isAfter(endHours)) {
    return true;
  }
  const timestamps = flattenSlots(existingSlots);

  return !timestamps.some((slot) => {
    const slotStart = moment(slot);
    const slotEnd = moment(slot).add(30, "minutes");
    return currentStart.isBefore(slotEnd) && currentEnd.isAfter(slotStart);
  });
};

const getSlots = (date, timezone, existingSlots = []) => {
  const slotDuration = config.DURATION;

  const [userStartDate, userEndDate] = getConfigUTC(date);
  const slots = [];
  let current = moment(userStartDate);
  while (current < userEndDate) {
    const notBooked = slotExists(
      current.valueOf(),
      existingSlots,
      slotDuration
    );
    if (notBooked) {
      slots.push(current.tz(timezone).format("YYYY-MM-DD HH:mm"));
    }
    current.add(slotDuration, "minutes");
  }

  return slots;
};

const formattedDates = (data) => {
  return data.map((item) => {
    return {
      id: item?.id,
      timestamp: item?.timestamp?.map((ts) => {
        const date = moment.utc(ts.seconds * 1000 + ts.nanoseconds / 1000000);
        return date.format("YYYY-MM-DD h:mm A");
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
  flattenSlots,
};
