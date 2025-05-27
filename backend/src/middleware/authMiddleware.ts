import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { requireEnv } from "../config/validateEnv";

const JWT_SECRET = requireEnv("JWT_SECRET");

// ✅ Define the expected shape of the JWT payload
interface JwtPayload {
  id: string;
  role: "creator"; 
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      if (decoded.role !== "creator") {
        res.status(403).json({ message: "Forbidden: Invalid role" });
        return;
      }
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }
  } else {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }
};
