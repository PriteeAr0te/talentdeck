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
// import authMiddleware from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoute);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// DB + Server Boot 
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
