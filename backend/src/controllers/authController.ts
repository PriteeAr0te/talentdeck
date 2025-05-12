import { Request, Response } from "express";
import { User, IUserDocument } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { registerUserSchema, loginUserSchema } from "../validators/authValidators";
import { ZodError } from "zod";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    // const { fullName, email, password } = req.body;

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

        res.status(201).json({
            _id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user._id.toString()),
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
    // const { email, password } = req.body;

    try {
        const validatedData = loginUserSchema.parse(req.body);
        const user = await User.findOne({ email: validatedData.email });

        if (user?._id && (await user.matchPassword(validatedData.password))) {
            res.status(200).json({
                _id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user._id.toString()),
            })
        } else {
            res.status(401).json({ message: "Invalid Email or Password" });
            return;
        }
    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}
