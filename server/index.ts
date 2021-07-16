import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { initDB } from "./database";
import logger from "./log";
import apiRouter from "./routes/apiRouter";

const PORT = process.env.PORT || 6565;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  //DEV
  //TODO: Send the production-ready built website
  res.send("Hello, Monity!");
});

app.listen(PORT, () => {
  logger.info(`App has started on port ${PORT}`, "EXPRESS");
});

initDB();
