const express = require("express");
const app = express();
const port = 3000;

const events = require("./routes/events_api");

app.use("/", events);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
