"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
exports.registerUserSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(3, { message: "Full name must be at least 3 characters." })
        .max(40, { message: "Full name must not exceed 40 characters." })
        .regex(nameRegex, {
        message: "Full name must contain only letters and single spaces between words. No digits or special characters allowed.",
    }),
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address format." })
        .refine((email) => /^[a-zA-Z0-9]/.test(email), {
        message: "Email should not start with a special character.",
    }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(32, { message: "Password must not exceed 32 characters." })
        .refine((val) => /[a-z]/.test(val) &&
        /[A-Z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val) &&
        !/\s/.test(val), {
        message: "Password must contain uppercase, lowercase, digit, special character, and no spaces.",
    }),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address format." })
        .refine((email) => /^[a-zA-Z0-9]/.test(email), {
        message: "Email should not start with a special character.",
    }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .refine((val) => /[a-z]/.test(val) &&
        /[A-Z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val) &&
        !/\s/.test(val), {
        message: "Password must contain uppercase, lowercase, digit, special character, and no spaces.",
    }),
});
//# sourceMappingURL=authValidators.js.map