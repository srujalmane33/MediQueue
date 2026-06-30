import express from "express";
import {
  getAdminStats,
  getAllUsers,
  toggleSuspendUser,
  createHospital,
  getHospitals,
  addDepartment,
} from "../controllers/admin.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", protect, getAdminStats);
router.get("/users", protect, getAllUsers);
router.patch("/users/:id/suspend", protect, toggleSuspendUser);
router.post("/hospitals", protect, createHospital);
router.get("/hospitals", getHospitals); // Get hospitals is public for doctor register / patient booking
router.patch("/hospitals/:id/department", protect, addDepartment);

export default router;
