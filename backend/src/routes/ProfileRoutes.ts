import express from "express";
import { createProfile, getMyProfile, updateProfile, deleteProfile, searchProfiles, getProfileByUsername, getAllSkills, getAllTags, toggleBookmark, getAllBookmarks } from "../controllers/ProfileController";
import { protect } from "../middleware/authMiddleware";
import { publicLimiter } from "../middleware/rateLimiter";
import { upload } from "../middleware/uploadMiddleware";

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

router.get("/bookmarks", protect, getAllBookmarks);
router.get("/me", protect, getMyProfile);
router.delete("/", protect, deleteProfile);
router.get("/skills", getAllSkills);
router.get("/tags", getAllTags);
router.get("/", publicLimiter, searchProfiles);
router.get("/:username", publicLimiter, getProfileByUsername);
router.post("/bookmarks/:profileId", protect, toggleBookmark)

export default router;
