import express from "express";
import { registerUser, loginUser, getUser } from "../controllers/authController";
import { authLimiter } from "../middleware/rateLimiter";
import { protect } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/me", protect, getUser);

export default router;
