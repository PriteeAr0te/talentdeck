"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = require("../config/validateEnv");
const JWT_SECRET = (0, validateEnv_1.requireEnv)("JWT_SECRET");
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, JWT_SECRET, {
        expiresIn: "30d",
    });
};
exports.generateToken = generateToken;
//# sourceMappingURL=generateToken.js.map