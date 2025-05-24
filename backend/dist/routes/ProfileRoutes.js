"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProfileController_1 = require("../controllers/ProfileController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const profileUploadMiddleware_1 = __importDefault(require("../middleware/profileUploadMiddleware"));
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, profileUploadMiddleware_1.default.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'projectImages', maxCount: 10 },
]), ProfileController_1.createProfile);
router.put("/", authMiddleware_1.protect, profileUploadMiddleware_1.default.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'projectImages', maxCount: 10 },
]), ProfileController_1.updateProfile);
router.get("/me", authMiddleware_1.protect, ProfileController_1.getMyProfile);
router.delete("/", authMiddleware_1.protect, ProfileController_1.deleteProfile);
router.get("/", rateLimiter_1.publicLimiter, ProfileController_1.searchProfiles);
router.get("/:username", rateLimiter_1.publicLimiter, ProfileController_1.getProfileByUsername);
exports.default = router;
//# sourceMappingURL=ProfileRoutes.js.map