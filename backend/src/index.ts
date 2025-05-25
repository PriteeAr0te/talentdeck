import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import healthRoute from './routes/healthRoute';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/ProfileRoutes';
import path from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api', healthRoute);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('✅ MongoDB connected');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }

  app(req as any, res as any);
  return
}
