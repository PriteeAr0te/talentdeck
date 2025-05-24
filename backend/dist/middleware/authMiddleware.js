"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = require("../config/validateEnv");
const JWT_SECRET = (0, validateEnv_1.requireEnv)("JWT_SECRET");
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (decoded.role !== "creator") {
                res.status(403).json({ message: "Forbidden: Invalid role" });
                return;
            }
            req.user = {
                id: decoded.id,
                role: decoded.role,
            };
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return;
        }
    }
    else {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map