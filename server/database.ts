import { Sequelize } from "sequelize";
import logger from "./log";

//For development purposes, the app uses SQLite. In the production, it would be probably PostgreSQL.
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.db",
  logging: (msg) => logger.debug(msg, "DB"),
});

async function initDB() {
  try {
    await sequelize.authenticate();
    logger.info("App has successfully connected to the database", "DB");

    //DEV
    //TODO: Set force to false in production
    await sequelize.sync({ force: true });
  } catch (error) {
    logger.error(
      `Unable to connect to the database: ${error.toString()}`,
      "DB"
    );
  }
}

export { initDB, sequelize as db };
