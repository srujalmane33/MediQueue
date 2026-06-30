import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./src/routes/auth.routes.js";
import doctorRoutes from "./src/routes/doctor.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

const app = express();

// Security middlewares
app.use(cors({
  origin: "*", // Adjust origins for production
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

// Rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(cookieParser());

// Mount routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to MediQueue API 🚀",
  });
});

export default app;