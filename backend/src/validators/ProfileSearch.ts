import { z } from 'zod'

export const profileSearchSchema = z.object({
    q: z.string().optional(),
    skills: z.string().optional(),
    tags: z.string().optional(),
    category: z.enum(["Graphic Designer", "UI/UX Designer", "Software Developer", "Content Creator", "Video Editor", "Other"]).optional(),
    availableforwork: z.boolean().optional(),
    "location.city": z.string().optional(),
    "location.country": z.string().optional(),
    "location.state": z.string().optional(),
    sortBy: z.enum(["createdAt", "username"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});


