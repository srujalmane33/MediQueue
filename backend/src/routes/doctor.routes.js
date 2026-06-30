import express from "express";

import {
  registerDoctor,
  doctorLogin,
  doctorProfile,
} from "../controllers/doctor.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerDoctor);

router.post("/login", doctorLogin);

router.get("/profile", protect, doctorProfile);

export default router;