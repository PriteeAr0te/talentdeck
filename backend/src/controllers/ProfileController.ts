import { Request, Response } from "express";
import { Profile } from '../models/Profile';
import { createProfileSchema } from '../validators/profileValidators';
import { profileSearchSchema } from "../validators/ProfileSearch";
import sanitizeHtml from 'sanitize-html';

export const createProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const files = req.files as {
            [fieldName: string]: Express.Multer.File[];
        };

        const profilePicture = files?.profilePicture?.[0];
        const projectImages = files?.projectImages || [];

        // ✅ Manual file presence validation
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

        // ✅ Build full input AFTER file validation
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

        // ✅ Schema validation
        const parsedData = createProfileSchema.safeParse(fullInput);

        if (!parsedData.success) {
            res.status(400).json({ error: parsedData.error.flatten() });
            console.log("Zod Validation Error", parsedData.error.flatten());
            return;
        }

        const sanitizeBio = sanitizeHtml(parsedData.data?.bio || '');
        const sanitizeHeadline = sanitizeHtml(parsedData.data?.headline || '');

        const userId = req.user.id;
        const existingProfile = await Profile.findOne({ userId });

        if (existingProfile) {
            res.status(400).json({ error: "You have already created a profile." });
            return;
        }

        const newProfileData = {
            userId,
            ...parsedData.data,
            bio: sanitizeBio,
            headline: sanitizeHeadline,
            profilePicture: profilePicture.path,
            projectImages: projectImages.map((file) => file.path),
        };

        const newProfile = new Profile(newProfileData);
        await newProfile.save();

        res.status(201).json({ message: "Profile created successfully.", isProfileCreated: true });

    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const profile = await Profile.findOne({ userId });

        if (!profile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const updateData: any = { ...req.body }

        if (updateData.bio) {
            updateData.bio = sanitizeHtml(updateData.bio);
        }

        if (updateData.headline) {
            updateData.headline = sanitizeHtml(updateData.headline);
        }

        const files = req.files as {
            [fieldName: string]: Express.Multer.File[];
        }

        if (files?.profilePicture[0]) {
            updateData.profilePicture = files.profilePicture[0].path;
        }

        if (files?.projectImages.length) {
            updateData.projectImages = files.projectImages.map((file: Express.Multer.File) => file.path);
        }

        // if(req.file) {
        //     updateData.profilePicture = req.file.path;
        // }

        const updateProfile = await Profile.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true }
        );

        if (!updateProfile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }

        res.status(200).json(updateProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const deletedProfile = await Profile.findByIdAndDelete({ userId });

        if (!deletedProfile) {
            res.status(404).json({ error: "Profile not found" });
            return;
        }

        res.status(200).json({ message: "Profile deleted successfully" });

    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}


export const searchProfiles = async (req: Request, res: Response): Promise<void> => {
    const parsed = profileSearchSchema.safeParse(req.query);

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }

    const { q, skills, tags, category, availableforwork, "location.city": city, "location.country": country, "location.state": state, sortBy, sortOrder, page, limit } = parsed.data;

    const filter: any = { isVisible: true };
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
    const sortOptions: Record<string, 1 | -1> = {
        [String(sortBy)]: sortOrder === "asc" ? 1 : -1,
    };


    const [total, profiles] = await Promise.all([
        Profile.countDocuments(filter),
        Profile.find(filter)
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


}
