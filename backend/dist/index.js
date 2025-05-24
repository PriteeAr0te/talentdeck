"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const healthRoute_1 = __importDefault(require("./routes/healthRoute"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ProfileRoutes_1 = __importDefault(require("./routes/ProfileRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use('/api', healthRoute_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/profile', ProfileRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, './uploads')));
(0, db_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Connected to MongoDB`);
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ Database connection failed:', err);
});
//# sourceMappingURL=index.js.map