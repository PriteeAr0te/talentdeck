import express from "express";
import { createProfile, getMyProfile, updateProfile, deleteProfile } from "../controllers/ProfileController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createProfile);
router.get("/me", protect, getMyProfile);
router.put("/", protect, updateProfile);
router.delete("/", protect, deleteProfile);

export default router;
