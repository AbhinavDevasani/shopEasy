import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserActivities,
} from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getUserProfile);
router.put("/", authMiddleware, updateUserProfile);
router.get("/activities", authMiddleware, getUserActivities);

export default router;
