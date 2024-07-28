const express = require("express");
const router = express.Router();

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

module.exports = router;
