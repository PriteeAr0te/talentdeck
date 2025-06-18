/**
 * TalentDeck Backend Entry Point
 * --------------------------------
 * Tech Stack: Node.js, Express, TypeScript, MongoDB
 * Purpose: Bootstraps server, loads middleware, connects DB
 */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import healthRoute from './routes/healthRoute';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/ProfileRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  // origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api', healthRoute);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (_, res) => {
  res.send({
    activeStatus: true,
    error: false
  })
})

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Connected to MongoDB`);
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });