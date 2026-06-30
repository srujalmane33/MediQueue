import express from "express";
import {
  register,
  login,
  refresh,
  profile,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

router.get("/profile", protect, profile);

export default router;