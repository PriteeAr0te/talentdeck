import { Request, Response } from "express";
import { Profile } from '../models/Profile';
import { createProfileSchema } from '../validators/profileValidators';

export const createProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedData = createProfileSchema.safeParse(req.body);

        if (!parsedData.success) {
            res.status(400).json({ error: parsedData.error.flatten() });
            return;
        }

        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const userId = req.user.id;

        const existingProfile = await Profile.findOne({ userId });

        if (existingProfile) {
            res.status(400).json({ error: "You have already created a profile." });
            return;
        }

        const newProfileData: any = {
            userId,
            ...parsedData.data
        }

        const files = req.files as {
            [fieldName: string]: Express.Multer.File[];
        }

        if(files?.profilePicture[0]) {
            newProfileData.profilePicture = files.profilePicture[0].path;
        }

        if(files?.projectImages.length) {
            newProfileData.projectImages = files.projectImages.map((file: Express.Multer.File) => file.path);
        }

        // if(req.file) {
        //     newProfileData.profilePicture = req.file.path;
        // }

        const newProfile = new Profile(newProfileData);

        await newProfile.save();

        res.status(201).json({ message: "Profile created successfully." });
        return;

    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
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
        const updateData: any = {...req.body}

        const files = req.files as {
            [fieldName: string]: Express.Multer.File[];
        }

        if(files?.profilePicture[0]) {
            updateData.profilePicture = files.profilePicture[0].path;
        }

        if(files?.projectImages.length) {
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
        const deletedProfile = await Profile.findByIdAndDelete({userId});

        if(!deletedProfile) {
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
