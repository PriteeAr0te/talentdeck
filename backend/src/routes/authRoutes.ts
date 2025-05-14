import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { authLimiter } from "../middleware/rateLimiter";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authLimiter, loginUser);

export default router;
