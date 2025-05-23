import { z } from "zod";

const urlSchema = z.string().url();
  
export const createProfileSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters long").max(20, "Username must be less than 20 characters long"),

    headline: z.string().max(100, "Headline must be less than 100 characters long").optional(),

    category: z.enum(["Graphic Designer", "UI/UX Designer", "Software Developer", "Content Creator", "Video Editor", "Other"], {
        message: "Please select a valid category"
    }),

    location: z.object({
        city: z.string().min(2, "City is required."),
        state: z.string().min(2, "State is required."),
        country: z.string().min(2, "Country is required."),
    }),

    bio: z.string().max(500, "Bio must be less than 500 characters long").optional(),

    skills: z.array(z.string().min(1)).min(1, "At least one skill is required."),

    availableforwork: z.boolean().optional(),

    tags: z.array(z.string()).optional(),

    isVisible: z.boolean().optional(),

    // profilePicture: z
    //     .any()
    //     .refine((file) => file instanceof File || file === undefined || file === null, {
    //         message: "Profile picture must be a valid file",
    //     }),

    // projectImages: z
    //     .any()
    //     .refine((files) => Array.isArray(files) && files.every((f) => f instanceof File), {
    //         message: "Each project image must be a valid file",
    //     }),

    portfolioLinks: z.array(
        z.object({
            label: z.string().min(2, "Label is required."),
            url: urlSchema,
        })
    ).optional(),

    socialLinks: z.array(
        z.object({
            label: z.string().min(2, "Label is required."),
            isVisible: z.boolean().optional(),
            url: urlSchema,
        })
    ).optional(),

});

export type CreateProfileSchema = z.infer<typeof createProfileSchema>;
