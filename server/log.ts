import fs from "fs";
import { formatDate } from "./utils";

enum logLevels {
  info = "INFO",
  error = "ERROR",
  debug = "DEBUG",
}

class Log {
  enableFiles: boolean = false;
  constructor(enableFiles: boolean) {
    this.enableFiles = enableFiles;
  }

  log(
    message: string,
    level: logLevels,
    label?: string,
    dontWriteToFile?: boolean
  ) {
    console.log(
      `[${
        this.getLevelColor(level) + level.toString() + "\x1b[0m"
      }] [${formatDate(new Date())}]${label ? ` (${label})` : ""} ${message}`
    );

    let log = {
      level: level.toString(),
      message: message,
      label: label,
      timestamp: new Date().toISOString(),
    };

    if (dontWriteToFile || !this.enableFiles) return;

    fs.appendFile("logs.log", JSON.stringify(log) + "\n", (err) => {
      if (err) {
        this.error(err.toString(), "FS", true);
      }
    });
  }

  info(message: string, label?: string, dontWriteToFile?: boolean) {
    this.log(message, logLevels.info, label, dontWriteToFile);
  }

  debug(message: string, label?: string, dontWriteToFile?: boolean) {
    this.log(message, logLevels.debug, label, dontWriteToFile);
  }
  error(message: string, label?: string, dontWriteToFile?: boolean) {
    this.log(message, logLevels.error, label, dontWriteToFile);
  }

  getLevelColor(level: logLevels): string {
    switch (level) {
      //Credit: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
      case logLevels.info:
        return "\x1b[34m";
      case logLevels.debug:
        return "";
      case logLevels.error:
        return "\x1b[31m";
      default:
        return "";
    }
  }
}

export default Log;

/*
Alternative way (needs winston):
import winston from "winston";

const loggingFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `[${level}] [${timestamp}]${label ? ` ${label}` : ""} ${message}`;
  }
);

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs.log", level: "info" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        loggingFormat
      ),
    }),
  ],
});

export default logger;
*/
