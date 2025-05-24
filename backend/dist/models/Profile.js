"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const profileSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    headline: {
        type: String,
        maxlength: 100,
    },
    category: {
        type: String,
        required: true,
        enum: ["Graphic Designer", "UI/UX Designer", "Software Developer", "Content Creator", "Video Editor", "Other"],
    },
    location: {
        city: { type: String },
        state: { type: String },
        country: { type: String },
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    skills: [String],
    tags: [String],
    availableforwork: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    portfolioLinks: [
        {
            label: { type: String },
            url: { type: String },
        }
    ],
    socialLinks: [
        {
            label: { type: String },
            isVisible: { type: Boolean, default: true },
            url: { type: String },
        }
    ],
    profilePicture: { type: String, default: '' },
    projectImages: [{ type: String }],
}, { timestamps: true });
profileSchema.index({
    username: 'text',
    headline: 'text',
    bio: 'text',
    skills: 'text',
    tags: 'text',
    'location.city': 'text',
    'location.state': 'text',
    'location.country': 'text',
});
exports.Profile = mongoose_1.default.model("Profile", profileSchema);
//# sourceMappingURL=Profile.js.map