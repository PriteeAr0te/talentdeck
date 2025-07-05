import mongoose, { Document, HydratedDocument, Schema } from "mongoose";

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
    likes?: [mongoose.Types.ObjectId];
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
            city: { type: String },
            state: { type: String },
            country: { type: String },
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        skills: [String],
        tags: [String],
        availableforwork: { type: Boolean, default: true },
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
        profilePicture: { type: String, default: '' },
        projectImages: [{ type: String }],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: [],
            }   
        ]
    },
    { timestamps: true }
);

profileSchema.index({
    username: 'text',
    headline: 'text',
    bio: 'text',
    skills: 'text',
    tags: 'text',
    'location.city': 'text',
    'location.state': 'text',
    'location.country': 'text',
});

export const Profile = mongoose.model<IProfile>("Profile", profileSchema);
export type IProfileDocument = HydratedDocument<IProfile>;
