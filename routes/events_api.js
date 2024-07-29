const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const config = require("../config");
const { getEvents, addEvent } = require("../firebase_config");
const {
  getSlots,
  formattedDates,
  slotExists,
  flattenSlots,
} = require("../utils/utils");

router.get("/", (req, res) => {
  res.send("Get ready to book an appointment with Dr John");
});

router.get("/config", (req, res) => {
  res.json({
    startHours: config.START_HOURS,
    endHours: config.END_HOURS,
    duration: config.DURATION,
    timezone: config.TIMEZONE,
  });
});

router.get("/free_slots", async (req, res) => {
  const { date, timezone } = req.query;
  const existingSlots = await getEvents();
  const slots = getSlots(date, timezone, existingSlots);
  res.json(slots);
});

router.get("/events", async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .send("start dates and end dates are both mandatory");
    }

    const startDate = moment(start, "YYYY-MM-DD", true);
    const endDate = moment(end, "YYYY-MM-DD", true);

    if (!startDate.isValid() || !endDate.isValid()) {
      return res.status(400).send("Invalid Date");
    }

    const startTimestamp = startDate.valueOf();
    const endTimestamp = endDate.valueOf();

    const existingSlots = await getEvents();

    const filteredData = existingSlots.filter((item) => {
      const itemDate = moment(item.id, "YYYY-MM-DD").valueOf();
      return itemDate >= startTimestamp && itemDate < endTimestamp;
    });

    const resp = formattedDates(filteredData);
    res.json(resp);
  } catch (e) {
    res.status(500).send(`Internal Server Error | Could not fetch | ${e}`);
  }
});

router.post("/add_event", async (req, res) => {
  try {
    const { timestamp } = req.query;
    if (!timestamp || isNaN(timestamp)) {
      return res.status(400).send("Invalid timestamp");
    }

    const timestampSec = timestamp / 1000;
    const dateTime = moment.unix(timestampSec).utc();
    const formattedDate = dateTime.format("YYYY-MM-DD");
    const existingSlots = await getEvents();

    const isAvailable = slotExists(timestamp, existingSlots, config.DURATION);
    if (!isAvailable) {
      return res.status(422).send("This slot is unavailable");
    }
    await addEvent(formattedDate, timestamp);
    const responseMessage = `Appointment successfully booked`;
    res.send(responseMessage);
  } catch (e) {
    res
      .status(500)
      .send(`Internal Server Error | Could not book appointment ${e}`);
  }
});

module.exports = router;
