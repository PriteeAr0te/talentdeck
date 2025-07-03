import { Request, Response } from "express";
import { User, IUserDocument, IUser } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { registerUserSchema, loginUserSchema } from "../validators/authValidators";
import { ZodError } from "zod";
import { HydratedDocument } from "mongoose";
import { Profile } from "../models/Profile";

export const registerUser = async (req: Request, res: Response): Promise<void> => {

    try {
        const validatedData = registerUserSchema.parse(req.body);
        const userExist = await User.findOne({ email: validatedData.email });
        if (userExist) {
            res.status(400).json({ message: "User Already Exists" });
            return;
        }

        const user = await User.create(validatedData) as IUserDocument;

        if (!user?._id) {
            res.status(400).json({ message: "Invalid User Data" });
            return;
        }

        const profileCreated = false;

        res.status(201).json({
            token: generateToken(user._id.toString(), user.role),
            user: {
                _id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profileCreated,
            },
            message: "Registered Successfully"
        });
    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = loginUserSchema.parse(req.body);

        const user = await User.findOne({ email: validatedData.email }) as HydratedDocument<IUser> | null;

        if (!user) {
            res.status(404).json({ message: "User not found with this email" });
            return;
        }

        const isMatch = await user.matchPassword(validatedData.password);
        if (!isMatch) {
            res.status(401).json({ message: "Incorrect password" });
            return;
        }

        const profile = await Profile.findOne({ user: user._id });

        const profileCreated = Boolean(profile);

        if (profileCreated && !user.profileCreated) {
            user.profileCreated = true;
            await user.save();
        }

        const updatedUser = await User.findById(user._id).select("-password")

        res.status(200).json({
            token: generateToken(user._id.toString(), user.role),
            user: {
                _id: updatedUser?._id.toString(),
                fullName: updatedUser?.fullName,
                email: updatedUser?.email,
                role: updatedUser?.role,
                profileCreated: updatedUser?.profileCreated ?? false,
            },
            message: "Login Successfully"
        });

    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.errors[0].message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await User.findById(userId).select("-password").populate("profile");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            user: {
                _id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profileCreated: user.profileCreated,
                bookmarks: user.bookmarks.map(bookmark => bookmark.toString()),
                profile: {
                    profilePicture: user.profile?.profilePicture || null,
                    username: user.profile?.username || null,
                }
            },
            message: "User fetched successfully"
        });
    } catch (error: any) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


