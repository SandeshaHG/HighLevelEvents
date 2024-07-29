const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const config = require("../config");
const { getEvents, addEvent } = require("../firebase_config");
const { getSlots, formattedDates } = require("../utils/utils");

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
  res.json(existingSlots);
  const slots = getSlots(date, timezone, existingSlots);
  res.json(slots);
});

router.get("/events", async (req, res) => {
  const existingSlots = await getEvents();
  const resp = formattedDates(existingSlots);
  res.json(resp);
});

router.post("/add_event", async (req, res) => {
  const { timestamp } = req.query;
  const timestampSec = timestamp / 1000;

  const dateTime = moment.unix(timestampSec).utc();

  const formattedDate = dateTime.format("YYYY-MM-DD");

  await addEvent(formattedDate, timestamp, config.DURATION);
  const responseMessage = `Appointment successfully booked`;
  res.send(responseMessage);
});

module.exports = router;
