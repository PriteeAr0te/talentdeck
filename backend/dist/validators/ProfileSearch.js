"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSearchSchema = void 0;
const zod_1 = require("zod");
exports.profileSearchSchema = zod_1.z.object({
    q: zod_1.z.string().optional(),
    skills: zod_1.z.string().optional(),
    tags: zod_1.z.string().optional(),
    category: zod_1.z.enum(["Graphic Designer", "UI/UX Designer", "Software Developer", "Content Creator", "Video Editor", "Other"]).optional(),
    availableforwork: zod_1.z.boolean().optional(),
    "location.city": zod_1.z.string().optional(),
    "location.country": zod_1.z.string().optional(),
    "location.state": zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(["createdAt", "username"]).optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
});
//# sourceMappingURL=ProfileSearch.js.map