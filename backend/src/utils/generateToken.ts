import jwt from "jsonwebtoken";
import { requireEnv } from "../config/validateEnv";

const JWT_SECRET = requireEnv("JWT_SECRET");

export const generateToken = (userId: string, role: string): string => {
    return jwt.sign({id: userId, role}, JWT_SECRET, {
        expiresIn: "30d",
    });

};
