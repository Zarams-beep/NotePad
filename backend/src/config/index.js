import dotenv from "dotenv";
dotenv.config();

export default {
    DB_NAME: process.env.DB_NAME || 'notepad',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'Godgracefree1&',
    DB_HOST : process.env.DB_HOST || 'localhost',
    DB_PORT : process.env.DB_PORT || 5432,
      REDIS_TTL: Number(process.env.REDIS_TTL || 300),
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  JWT_SECRET : process.env.JWT_SECRET || "your_jwt_secret_key",
   JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN || 7200),

   TOTAL_URL : process.env.LOCAL_URL || process.env.PROD_URL,

   PORT : process.env.PORT || 5000,
   SMTP_HOST: process.env.SMTP_HOST || "smtp.example.com",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || "dev",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "devpass",
  SMTP_SECURE: process.env.SMTP_SECURE === "true" || false,
}