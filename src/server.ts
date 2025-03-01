import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json({ limit: "100mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "100mb" })); // Handle URL-encoded data

// Enable CORS (allow all origins)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
