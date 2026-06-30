import express from "express";

import {
  registerDoctor,
  doctorLogin,
  doctorProfile,
  getDoctors,
  getDoctorById,
  updateDoctorAvailability,
  updateDoctorProfile,
} from "../controllers/doctor.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerDoctor);

router.post("/login", doctorLogin);

router.get("/profile", protect, doctorProfile);

router.patch("/availability", protect, updateDoctorAvailability);

router.patch("/profile", protect, updateDoctorProfile);

router.get("/", getDoctors);

router.get("/:id", getDoctorById);
export default router;
