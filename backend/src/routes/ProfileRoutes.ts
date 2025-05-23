import express from "express";
import { createProfile, getMyProfile, updateProfile, deleteProfile, searchProfiles, getProfileByUsername } from "../controllers/ProfileController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/profileUploadMiddleware";
import { publicLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post(
    "/",
    protect,
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'projectImages', maxCount: 10 },
    ]),
    createProfile
);

router.put(
    "/",
    protect,
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'projectImages', maxCount: 10 },
    ]),
    updateProfile
);

router.get("/me", protect, getMyProfile);
router.delete("/", protect, deleteProfile);
router.get("/", publicLimiter, searchProfiles);
router.get("/:username", publicLimiter, getProfileByUsername);

export default router;
