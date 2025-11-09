import { Sequelize } from "sequelize";
import config from "./index.js";
import process from "node:process";

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    dialect: "postgres",
    define: {
      // Added critical case-sensitivity config
      freezeTableName: true,
      quoteIdentifiers: true, // Preserve case
      schema: "public",
      underscored: false,
    },
    host: config.DB_HOST,
    port: config.DB_PORT,
    logging: false,
    // logging: (msg) => console.log(msg),
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();

    // Verify connection with case-sensitive query
    const [result] = await sequelize.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_name = 'Users'`
    );
  } catch (error) {
    console.error(" Connection Failed:", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
