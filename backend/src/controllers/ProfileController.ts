import { Request, Response } from "express";
import { Profile } from '../models/Profile';
import { createProfileSchema, updateProfileSchema } from '../validators/profileValidators';
import { profileSearchSchema } from "../validators/ProfileSearch";
import sanitizeHtml from 'sanitize-html';
import { slugifyUserName } from "../utils/slagifyUserName";
import { ZodError } from "zod";
import { User } from "../models/User";
import { normalizeTagOrSkill } from "../utils/normalize";

interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export const createProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const files = req.files as {
            [fieldName: string]: Express.Multer.File[];
        };

        const profilePictureFile = files?.profilePicture?.[0];
        const projectImageFiles = files?.projectImages || [];

        if (
            !Array.isArray(projectImageFiles) ||
            projectImageFiles.some((file) => !file?.originalname)
        ) {
            res.status(400).json({
                error: {
                    fieldErrors: {
                        projectImages: ["Each project image must be a valid file."]
                    }
                }
            });
            return;
        }

        const parseArray = (input: any): any[] => {
            try {
                return typeof input === 'string' ? JSON.parse(input) : [];
            } catch {
                return [];
            }
        };

        const location = parseArray(req.body.location);
        const portfolioLinks = parseArray(req.body.portfolioLinks);
        const socialLinks = parseArray(req.body.socialLinks);
        let skills = parseArray(req.body.skills);
        let tags = parseArray(req.body.tags);

        skills = skills.map(normalizeTagOrSkill);
        tags = tags.map(normalizeTagOrSkill);

        const fullInput = {
            ...req.body,
            location,
            skills,
            tags,
            portfolioLinks,
            socialLinks,
            availableforwork: req.body.availableforwork === "true",
            isVisible: req.body.isVisible === "true",
            profilePicture: profilePictureFile.path || '',
            projectImages: projectImageFiles.map((file) => file.path),
        };

        const parsedData = createProfileSchema.safeParse(fullInput);
        if (!parsedData.success) {
            res.status(400).json({ error: parsedData.error.flatten() });
            return;
        }

        const sanitizeBio = sanitizeHtml(parsedData.data.bio || "");
        const sanitizeHeadline = sanitizeHtml(parsedData.data.headline || "");

        const userId = req.user.id;

        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            res.status(400).json({ error: "You have already created a profile." });
            return;
        }

        const slugifiedUsername = slugifyUserName(parsedData.data.username);

        const newProfileData = {
            userId,
            ...parsedData.data,
            username: slugifiedUsername,
            bio: sanitizeBio,
            headline: sanitizeHeadline,
            profilePicture: profilePictureFile.path || '',
            projectImages: projectImageFiles.map((file) => file.path),
        };

        const newProfile = new Profile(newProfileData);
        await newProfile.save();
        await User.findByIdAndUpdate(userId, { profileCreated: true });

        const updatedUser = await User.findById(userId).select("-password");

        res.status(201).json({
            message: "Profile created successfully.",
            profileCreated: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const profile = await Profile.findOne({ userId })
            .populate("likes", "id")
            .lean();

        if (!profile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }

        res.status(200).json({
            data: {
                ...profile,
                likes: profile.likes || [],
                likesCount: profile.likes?.length || 0
            }
        });
    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const rawData: any = { ...req.body };
        console.log("Raw data received for profile update:", rawData);

        const stringFields = ["location", "skills", "tags", "portfolioLinks", "socialLinks"];
        for (const key of stringFields) {
            if (typeof rawData[key] === "string") {
                try {
                    rawData[key] = JSON.parse(rawData[key]);
                } catch {
                    rawData[key] = [];
                }
            }
        }

        rawData.skills = Array.isArray(rawData.skills)
            ? rawData.skills.map(normalizeTagOrSkill)
            : [];

        rawData.tags = Array.isArray(rawData.tags)
            ? rawData.tags.map(normalizeTagOrSkill)
            : [];

        rawData.availableforwork = rawData.availableforwork === "true";
        rawData.isVisible = rawData.isVisible === "true";

        try {
            updateProfileSchema.parse(rawData);
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({ error: err.flatten() });
                return;
            }
            throw err;
        }

        if (rawData.bio) rawData.bio = sanitizeHtml(rawData.bio);
        if (rawData.headline) rawData.headline = sanitizeHtml(rawData.headline);

        const files = req.files as { [fieldName: string]: Express.Multer.File[] } | undefined;

        if (files?.profilePicture?.[0]) {
            rawData.profilePicture = files.profilePicture[0].path;
        }

        let retainedImages: string[] = [];
        if (typeof rawData.projectImagesToKeep === "string") {
            try {
                retainedImages = JSON.parse(rawData.projectImagesToKeep);
            } catch {
                retainedImages = [];
            }
        } else if (Array.isArray(rawData.projectImagesToKeep)) {
            retainedImages = rawData.projectImagesToKeep;
        }

        const uploadedImages = files?.projectImages?.map((file) => file.path) ?? [];

        rawData.projectImages = [...retainedImages, ...uploadedImages];

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId },
            { $set: rawData },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }

        res.status(200).json({ success: true, data: updatedProfile });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const deletedProfile = await Profile.findOneAndDelete({ userId });

        if (!deletedProfile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }

        res.status(200).json({ message: "Profile deleted successfully." });

    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const searchProfiles = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsed = profileSearchSchema.safeParse(req.query);

        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        const {
            q,
            skills,
            tags,
            category,
            availableforwork,
            "location.city": city,
            "location.country": country,
            "location.state": state,
            sortBy,
            sortOrder,
            page = 1,
            limit = 10,
        } = parsed.data;

        const filter: any = { isVisible: true };

        if (q) {
            filter.$text = { $search: q };
        }
        if (skills) {
            filter.skills = { $in: skills.split(",").map((s) => s.trim()) };
        }
        if (tags) {
            filter.tags = { $in: tags.split(",").map((t) => t.trim()) };
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

        const safePage = Math.max(Number(page) || 1, 1);
        const safeLimit = Math.min(Number(limit) || 10, 50);
        const skip = (safePage - 1) * safeLimit;

        const sortField = sortBy || "createdAt";
        const sortOptions: Record<string, 1 | -1> = {
            [sortField]: sortOrder === "asc" ? 1 : -1,
        };

        const [total, profiles] = await Promise.all([
            Profile.countDocuments(filter),
            Profile.find(filter).sort(sortOptions).skip(skip).limit(safeLimit).lean(),
        ]);

        res.status(200).json({
            meta: {
                total,
                page: safePage,
                pages: Math.ceil(total / safeLimit),
            },
            data: profiles,
        });
    } catch (error) {
        console.error("Error in searchProfiles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getProfileByUsername = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username } = req.params;

        if (!username || typeof username !== "string") {
            res.status(400).json({ error: "Username parameter is required." });
            return;
        }

        const profile = await Profile.findOne({ username, isVisible: true })
            .populate("likes", "_id")
            .populate("userId", "fullName email")
            .lean();

        if (!profile) {
            res.status(404).json({ error: "Profile not found." });
            return;
        }

        profile.bio = sanitizeHtml(profile.bio || "");
        profile.headline = sanitizeHtml(profile.headline || "");

        const likes = profile.likes?.map((like: any) =>
            typeof like === "object" && like !== null && "_id" in like ? like._id.toString() : like
        );

        res.status(200).json({
            success: true,
            data: {
                ...profile,
                profilePicture: profile.profilePicture || "",
                projectImages: profile.projectImages || [],
                likes: likes || [],
                likesCount: likes?.length || 0,
            },
        });

    } catch (error) {
        console.error("Error fetching profile by username:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllSkills = async (_req: Request, res: Response): Promise<void> => {
    const skills = await Profile.distinct("skills");
    res.json(skills)
}

export const getAllTags = async (_req: Request, res: Response): Promise<void> => {
    const tags = await Profile.distinct("tags");
    res.json(tags)
}

export const toggleBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log("user: ", req.user);
    const userId = req.user?.id;
    const { profileId } = req.params;

    if (!userId || !profileId) {
        res.status(400).json({ error: "Invalid Data." });
        return;
    }

    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
    }

    const mongoose = require("mongoose");
    const objectIdProfileId = new mongoose.Types.ObjectId(profileId);

    const index = user.bookmarks.findIndex((b) => b.toString() === profileId);
    let bookmarked = false;

    if (index === -1) {
        user.bookmarks.push(objectIdProfileId);
        bookmarked = true;
    } else {
        user.bookmarks.splice(index, 1);
        bookmarked = false;
    }

    await user.save();
    await user.populate("bookmarks");

    const bookmarks = Array.isArray(user.bookmarks)
        ? user.bookmarks.map((b: any) => b._id.toString())
        : [];

    res.status(200).json({
        message: bookmarked ? "Bookmark added." : "Bookmark removed.",
        bookmarked,
        bookmarks,
        user: {
            id: user._id.toString(),
            fullname: user.fullName,
            email: user.email,
            role: user.role,
            profileCreated: user.profileCreated,
            bookmarks,
        }
    });
}

export const getAllBookmarks = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log("📌 Hit GET /profile/bookmarks");
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await User.findById(userId)
            .populate("bookmarks")
            .select("bookmarks");

        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        const validBookmarks = user?.bookmarks.filter(Boolean);

        res.status(200).json({ data: validBookmarks });
        return;
    } catch (error) {
        console.error("Error in getAllBookmarks:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { profileId } = req.params;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        };

        const profile = await Profile.findById(profileId);
        if (!profile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        };

        const index = profile.likes?.findIndex((id) => id.toString() === userId);

        const mongoose = require("mongoose");
        const objectIdUserId = new mongoose.Types.ObjectId(userId);

        let liked = false;

        if (index !== undefined && index > -1) {
            profile.likes?.splice(index, 1);
        } else {
            profile.likes?.push(objectIdUserId);
            liked = true;
        }

        await profile.save();
        await profile.populate("likes");

        const likes = Array.isArray(profile.likes)
            ? profile.likes.map((b: any) => b._id.toString())
            : [];

        res.status(200).json({
            liked,
            likes,
            likesCount: likes.length || 0,
        });

    } catch (error) {
        console.error("Toggle like failed", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
