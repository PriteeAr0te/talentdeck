"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL is not defined in the environment variables');
        }
        const conn = await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map