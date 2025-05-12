import jwt from "jsonwebtoken";
import { requireEnv } from "../config/validateEnv";

const JWT_SECRET = requireEnv("JWT_SECRET");

export const generateToken = (userId: string): string => {
    return jwt.sign({id: userId}, JWT_SECRET, {
        expiresIn: "30d",
    });

};
