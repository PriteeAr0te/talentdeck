import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const publicLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 30, 
  message: 'Too many requests from this IP, slow down!',
  standardHeaders: true,
  legacyHeaders: false,
});
