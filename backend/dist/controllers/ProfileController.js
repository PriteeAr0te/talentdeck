"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileByUsername = exports.searchProfiles = exports.deleteProfile = exports.updateProfile = exports.getMyProfile = exports.createProfile = void 0;
const Profile_1 = require("../models/Profile");
const profileValidators_1 = require("../validators/profileValidators");
const ProfileSearch_1 = require("../validators/ProfileSearch");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const slagifyUserName_1 = require("../utils/slagifyUserName");
const zod_1 = require("zod");
const createProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const files = req.files;
        const profilePicture = files?.profilePicture?.[0];
        const projectImages = files?.projectImages || [];
        if (!profilePicture) {
            res.status(400).json({
                error: {
                    fieldErrors: {
                        profilePicture: ["Profile picture is required."]
                    }
                }
            });
            return;
        }
        if (!Array.isArray(projectImages) || projectImages.some((f) => !f || !f.originalname)) {
            res.status(400).json({
                error: {
                    fieldErrors: {
                        projectImages: ["Each project image must be a valid file."]
                    }
                }
            });
            return;
        }
        const fullInput = {
            ...req.body,
            location: JSON.parse(req.body.location),
            skills: JSON.parse(req.body.skills),
            portfolioLinks: JSON.parse(req.body.portfolioLinks),
            socialLinks: JSON.parse(req.body.socialLinks),
            availableforwork: req.body.availableforwork === "true",
            isVisible: req.body.isVisible === "true",
            profilePicture: profilePicture.path,
            projectImages: projectImages.map((file) => file.path),
        };
        const parsedData = profileValidators_1.createProfileSchema.safeParse(fullInput);
        if (!parsedData.success) {
            res.status(400).json({ error: parsedData.error.flatten() });
            console.log("Zod Validation Error", parsedData.error.flatten());
            return;
        }
        const sanitizeBio = (0, sanitize_html_1.default)(parsedData.data?.bio || '');
        const sanitizeHeadline = (0, sanitize_html_1.default)(parsedData.data?.headline || '');
        const userId = req.user.id;
        const existingProfile = await Profile_1.Profile.findOne({ userId });
        if (existingProfile) {
            res.status(400).json({ error: "You have already created a profile." });
            return;
        }
        const slugifiedUsername = (0, slagifyUserName_1.slugifyUserName)(parsedData.data.username);
        const newProfileData = {
            userId,
            ...parsedData.data,
            username: slugifiedUsername,
            bio: sanitizeBio,
            headline: sanitizeHeadline,
            profilePicture: profilePicture.path,
            projectImages: projectImages.map((file) => file.path),
        };
        const newProfile = new Profile_1.Profile(newProfileData);
        await newProfile.save();
        res.status(201).json({ message: "Profile created successfully.", isProfileCreated: true });
    }
    catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createProfile = createProfile;
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const profile = await Profile_1.Profile.findOne({ userId });
        if (!profile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
exports.getMyProfile = getMyProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const rawData = { ...req.body };
        try {
            profileValidators_1.updateProfileSchema.parse(rawData);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                res.status(400).json({ error: err.errors });
                return;
            }
            throw err;
        }
        if (rawData.bio)
            rawData.bio = (0, sanitize_html_1.default)(rawData.bio);
        if (rawData.headline)
            rawData.headline = (0, sanitize_html_1.default)(rawData.headline);
        const files = req.files;
        if (files?.profilePicture?.[0]) {
            rawData.profilePicture = files.profilePicture[0].path;
        }
        if (files?.projectImages?.length) {
            rawData.projectImages = files.projectImages.map(file => file.path);
        }
        const updatedProfile = await Profile_1.Profile.findOneAndUpdate({ userId }, { $set: rawData }, { new: true, runValidators: true });
        if (!updatedProfile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateProfile = updateProfile;
const deleteProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const deletedProfile = await Profile_1.Profile.findByIdAndDelete({ userId });
        if (!deletedProfile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }
        res.status(200).json({ message: "Profile deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
exports.deleteProfile = deleteProfile;
const searchProfiles = async (req, res) => {
    const parsed = ProfileSearch_1.profileSearchSchema.safeParse(req.query);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const { q, skills, tags, category, availableforwork, "location.city": city, "location.country": country, "location.state": state, sortBy, sortOrder, page, limit } = parsed.data;
    const filter = { isVisible: true };
    if (q) {
        filter.$text = { $search: q };
    }
    if (skills) {
        filter.skills = { $in: skills.split(",").map(s => s.trim()) };
    }
    if (tags) {
        filter.tags = { $in: tags.split(",").map(t => t.trim()) };
    }
    if (category) {
        filter.category = category;
    }
    if (availableforwork !== undefined) {
        filter.availableforwork = availableforwork;
    }
    if (city) {
        filter["location.city"] = city;
    }
    if (country) {
        filter["location.country"] = country;
    }
    if (state) {
        filter["location.state"] = state;
    }
    const skip = (page - 1) * limit;
    const sortOptions = {
        [String(sortBy)]: sortOrder === "asc" ? 1 : -1,
    };
    const [total, profiles] = await Promise.all([
        Profile_1.Profile.countDocuments(filter),
        Profile_1.Profile.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
    ]);
    res.json({
        meta: {
            total,
            page,
            pages: Math.ceil(total / limit),
        },
        data: profiles,
    });
};
exports.searchProfiles = searchProfiles;
const getProfileByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            res.status(400).json({ error: "Username parameter is required." });
            return;
        }
        const profile = await Profile_1.Profile.findOne({ username, isVisible: true }).lean();
        if (!profile) {
            res.status(404).json({ error: "Profile not found." });
            return;
        }
        profile.bio = (0, sanitize_html_1.default)(profile.bio || "");
        profile.headline = (0, sanitize_html_1.default)(profile.headline || "");
        res.status(200).json({ data: profile });
    }
    catch (error) {
        console.error("Error fetching profile by username:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getProfileByUsername = getProfileByUsername;
//# sourceMappingURL=ProfileController.js.map