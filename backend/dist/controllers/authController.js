"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const generateToken_1 = require("../utils/generateToken");
const authValidators_1 = require("../validators/authValidators");
const zod_1 = require("zod");
const Profile_1 = require("../models/Profile");
const registerUser = async (req, res) => {
    try {
        const validatedData = authValidators_1.registerUserSchema.parse(req.body);
        const userExist = await User_1.User.findOne({ email: validatedData.email });
        if (userExist) {
            res.status(400).json({ message: "User Already Exists" });
            return;
        }
        const user = await User_1.User.create(validatedData);
        if (!user?._id) {
            res.status(400).json({ message: "Invalid User Data" });
            return;
        }
        const profile = await Profile_1.Profile.create({ user: user._id });
        const profileCreated = profile ? true : false;
        res.status(201).json({
            token: (0, generateToken_1.generateToken)(user._id.toString(), user.role),
            user: {
                _id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profileCreated,
            },
            message: "Registered Successfully"
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const validatedData = authValidators_1.loginUserSchema.parse(req.body);
        const user = await User_1.User.findOne({ email: validatedData.email });
        if (!user) {
            res.status(404).json({ message: "User not found with this email" });
            return;
        }
        const isMatch = await user.matchPassword(validatedData.password);
        if (!isMatch) {
            res.status(401).json({ message: "Incorrect password" });
            return;
        }
        const profile = await Profile_1.Profile.findOne({ user: user._id });
        const profileCreated = profile ? true : false;
        res.status(200).json({
            token: (0, generateToken_1.generateToken)(user._id.toString(), user.role),
            user: {
                _id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profileCreated,
            },
            message: "Login Successfully"
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=authController.js.map