import express from "express";
import Log from "./log";

const PORT = process.env.PORT || 6565;

const app = express();
const logger = new Log(true);

app.get("/", (req, res) => {
  //DEV
  //TODO: Send the production-ready built website
  res.send("Hello, Monity!");
});

app.listen(PORT, () => {
  logger.info(`App has started on port ${PORT}`, "EXPRESS");
});
