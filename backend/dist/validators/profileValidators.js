"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.createProfileSchema = void 0;
const zod_1 = require("zod");
const urlSchema = zod_1.z.string().url();
exports.createProfileSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(2, "Username must be at least 2 characters long")
        .max(20, "Username must be less than 20 characters long"),
    headline: zod_1.z
        .string()
        .max(100, "Headline must be less than 100 characters long")
        .optional(),
    category: zod_1.z.enum([
        "Graphic Designer",
        "UI/UX Designer",
        "Software Developer",
        "Content Creator",
        "Video Editor",
        "Other",
    ], { message: "Please select a valid category" }),
    location: zod_1.z.object({
        city: zod_1.z.string().min(2, "City is required."),
        state: zod_1.z.string().min(2, "State is required."),
        country: zod_1.z.string().min(2, "Country is required."),
    }),
    bio: zod_1.z
        .string()
        .max(500, "Bio must be less than 500 characters long")
        .optional(),
    skills: zod_1.z
        .array(zod_1.z.string().min(1))
        .min(1, "At least one skill is required."),
    availableforwork: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    isVisible: zod_1.z.boolean().optional(),
    portfolioLinks: zod_1.z
        .array(zod_1.z.object({
        label: zod_1.z.string().min(2, "Label is required."),
        url: urlSchema,
    }))
        .optional(),
    socialLinks: zod_1.z
        .array(zod_1.z.object({
        label: zod_1.z.string().min(2, "Label is required."),
        isVisible: zod_1.z.boolean().optional(),
        url: urlSchema,
    }))
        .optional(),
});
exports.updateProfileSchema = exports.createProfileSchema.partial();
//# sourceMappingURL=profileValidators.js.map