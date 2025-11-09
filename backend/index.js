import express from "express";
import config from "./src/config/index.js";
import { connectDB, sequelize } from "./src/config/db.js";
import errorHandler from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import noteRoutes from "./src/routes/noteRoutes.js"; 
import cors from "cors";

const app = express();
const corsOptions = {
    origin: "http://localhost:59940",
}

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

//routes
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running fine and healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/dashboard", noteRoutes);

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route does not exist" });
});

app.use(errorHandler);

// Connect to database and sync models
await connectDB();

try {
  await sequelize.sync({ alter: true }); // Use { alter: true } for development
  console.log("Database synced successfully");
} catch (error) {
  console.error("Database sync failed:", error);
  process.exit(1); // Exit if database sync fails
}

// Start server
app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});