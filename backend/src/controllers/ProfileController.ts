import { Request, Response } from "express";
import { Profile } from '../models/Profile';
import { createProfileSchema, updateProfileSchema } from '../validators/profileValidators';
import { profileSearchSchema } from "../validators/ProfileSearch";
import sanitizeHtml from 'sanitize-html';
import { slugifyUserName } from "../utils/slagifyUserName";
import { ZodError } from "zod";

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

        const fullInput = {
            ...req.body,
            location: JSON.parse(req.body.location),
            skills: JSON.parse(req.body.skills),
            portfolioLinks: JSON.parse(req.body.portfolioLinks),
            socialLinks: JSON.parse(req.body.socialLinks),
            availableforwork: req.body.availableforwork === "true",
            isVisible: req.body.isVisible === "true",
            profilePicture: profilePictureFile.path || '',
            projectImages: projectImageFiles.map((file) => file.path),
        };

        const parsedData = createProfileSchema.safeParse(fullInput);
        if (!parsedData.success) {
            res.status(400).json({ error: parsedData.error.flatten() });
            console.log("Zod Validation Error", parsedData.error.flatten());
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

        res.status(201).json({
            message: "Profile created successfully.",
            isProfileCreated: true,
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

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }

        res.status(200).json(profile);
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

        // Parse stringified fields if needed
        const stringFields = ["location", "skills", "portfolioLinks", "socialLinks"];
        for (const key of stringFields) {
            if (typeof rawData[key] === "string") {
                try {
                    rawData[key] = JSON.parse(rawData[key]);
                } catch {
                    rawData[key] = [];
                }
            }
        }

        rawData.availableforwork = rawData.availableforwork === "true";
        rawData.isVisible = rawData.isVisible === "true";

        // Validate input
        try {
            updateProfileSchema.parse(rawData);
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({ error: err.flatten() });
                return;
            }
            throw err;
        }

        // Sanitize input
        if (rawData.bio) rawData.bio = sanitizeHtml(rawData.bio);
        if (rawData.headline) rawData.headline = sanitizeHtml(rawData.headline);

        // Handle uploaded images
        const files = req.files as { [fieldName: string]: Express.Multer.File[] } | undefined;

        if (files?.profilePicture?.[0]) {
            rawData.profilePicture = files.profilePicture[0].path; // Cloudinary URL
        }

        if (files?.projectImages?.length) {
            rawData.projectImages = files.projectImages.map((file) => file.path);
        }

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

        const skip = (page - 1) * limit;
        const sortField = sortBy || "createdAt";
        const sortOptions: Record<string, 1 | -1> = {
            [sortField]: sortOrder === "asc" ? 1 : -1,
        };

        const [total, profiles] = await Promise.all([
            Profile.countDocuments(filter),
            Profile.find(filter).sort(sortOptions).skip(skip).limit(limit),
        ]);

        res.status(200).json({
            meta: {
                total,
                page,
                pages: Math.ceil(total / limit),
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

        const profile = await Profile.findOne({ username, isVisible: true }).lean();

        if (!profile) {
            res.status(404).json({ error: "Profile not found." });
            return;
        }

        profile.bio = sanitizeHtml(profile.bio || "");
        profile.headline = sanitizeHtml(profile.headline || "");

        res.status(200).json({
            success: true,
            data: {
                ...profile,
                profilePicture: profile.profilePicture || "",
                projectImages: profile.projectImages || [],
            },
        });

    } catch (error) {
        console.error("Error fetching profile by username:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};