import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/book", protect, bookAppointment);
router.get("/my", protect, getMyAppointments);
router.get("/doctor", protect, getDoctorAppointments);
router.patch("/:id/status", protect, updateAppointmentStatus);

export default router;
