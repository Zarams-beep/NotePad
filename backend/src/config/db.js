import { Sequelize } from "sequelize";
import config from "./index.js";
import process from "node:process";

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    dialect: "postgres",
    host: config.DB_HOST,
    port: config.DB_PORT,
    logging: config.ENVIRONMENT === "development" ? console.log : false,
    
    define: {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
    },
    
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    console.log(` Connecting to PostgreSQL database: ${config.DB_NAME}`);
    
    await sequelize.authenticate();
    console.log(" Database connection established");
    
    // Sync models (only alter in development, never force)
    if (config.ENVIRONMENT === "development") {
      await sequelize.sync({ alter: true });
      console.log(" Database tables synchronized");
    }
    
    // Log active tables
    const tables = await sequelize.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log(` Active tables: ${tables.map(t => t.table_name).join(", ")}`);
    
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    
    // error messages
    if (error.message.includes("does not exist")) {
      console.error(`
💡 Database '${config.DB_NAME}' doesn't exist. Create it:
   
   psql -U postgres
   CREATE DATABASE ${config.DB_NAME};
   \\q
      `);
    } else if (error.message.includes("password authentication failed")) {
      console.error(" Check your database credentials in .env file");
    } else if (error.message.includes("Connection refused")) {
      console.error(" Make sure PostgreSQL is running");
    }
    
    process.exit(1);
  }
};

export { sequelize, connectDB };