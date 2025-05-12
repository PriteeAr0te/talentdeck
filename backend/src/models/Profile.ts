import mongoose, { Document, Schema } from "mongoose";

interface ILink {
    label: string;
    url: string;
}

export interface IProfile extends Document {
    userId: mongoose.Types.ObjectId;
    username: string;
    headline: string;
    category: "Graphic Designer" | "UI/UX Designer" | "Software Developer" | "Content Creator" | "Video Editor" | "Other";
    location: {
        city: string;
        state: string;
        country: string;
    };
    bio: string;
    skills: string[];
    availableforwork: boolean;
    tags?: string[];
    portfolioLinks: ILink[];
    socialLinks: ILink[];
    profilePicture: string;
    projectImages: string[];
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        headline: {
            type: String,
            maxlength: 100,
        },
        category: {
            type: String,
            required: true,
            enum: ["Graphic Designer", "UI/UX Designer", "Software Developer", "Content Creator", "Video Editor", "Other"],
        },
        location: {
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        skills: [String],
        tags: [String],
        availableforwork: { type: Boolean, default: false },
        isVisible: { type: Boolean, default: true },
        portfolioLinks: [
            {
                label: { type: String },
                url: { type: String },
            }
        ],
        socialLinks: [
            {
                label: { type: String },
                isVisible: { type: Boolean, default: true },
                url: { type: String },
            }
        ],
        profilePicture: { type: String },
        projectImages: [{ type: String }],
    },
    { timestamps: true }
);

export const Profile = mongoose.model<IProfile>("Profile", profileSchema);
