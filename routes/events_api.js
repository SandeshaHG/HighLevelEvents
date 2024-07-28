const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get ready to book an appointment with Dr John");
});

module.exports = router;
