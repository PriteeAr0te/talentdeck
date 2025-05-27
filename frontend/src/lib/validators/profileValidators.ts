import { z } from "zod";

const urlSchema = z.string().url();

export const baseProfileSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be less than 20 characters long"),

  headline: z
    .string()
    .max(100, "Headline must be less than 100 characters long")
    .optional(),

  category: z.enum(
    [
      "Graphic Designer",
      "UI/UX Designer",
      "Software Developer",
      "Content Creator",
      "Video Editor",
      "Other",
    ],
    {
      message: "Please select a valid category",
    }
  ),

  location: z.object({
    city: z.string().min(2, "City is required."),
    state: z.string().min(2, "State is required."),
    country: z.string().min(2, "Country is required."),
  }),

  bio: z.string().max(500, "Bio must be less than 500 characters long").optional(),

  skills: z
    .array(z.string().min(1, "Skill can't be empty"))
    .min(1, "At least one skill is required."),

  availableforwork: z.boolean().optional(),

  tags: z.array(z.string()).optional(),

  isVisible: z.boolean().optional(),

  portfolioLinks: z
    .array(
      z.object({
        label: z.string().min(2, "Label is required."),
        url: urlSchema,
        isVisible: z.boolean().optional(),
      })
    )
    .optional(),

  socialLinks: z
    .array(
      z.object({
        label: z.string().min(2, "Label is required."),
        url: urlSchema,
        isVisible: z.boolean().optional(),
      })
    )
    .optional(),

  profilePicture: z
    .instanceof(File)
    .optional()
    .or(z.literal(undefined))
    .or(z.null()),

  projectImages: z
    .array(z.instanceof(File))
    .optional()
    .or(z.literal(undefined))
    .or(z.null()),
});

export const createProfileSchema = baseProfileSchema;
export const updateProfileSchema = baseProfileSchema.partial();

export type CreateProfileSchema = z.infer<typeof createProfileSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
