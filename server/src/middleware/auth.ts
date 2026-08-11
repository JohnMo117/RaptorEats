import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Multi-tiered secure fallback as per securecoder_generation guidelines
export function getJwtSecret(): string {
  if (process.env.JWT_SECRET_KEY) {
    return process.env.JWT_SECRET_KEY;
  }
  
  const secretPath = path.join(__dirname, '../../jwt_secret.txt');
  if (fs.existsSync(secretPath)) {
    return fs.readFileSync(secretPath, 'utf-8').trim();
  }
  
  console.warn("Generating ephemeral secret. Instance-isolated!");
  const ephemeralSecret = crypto.randomBytes(32).toString('hex');
  
  // Optionally, save it so it survives server restarts locally
  try {
    fs.writeFileSync(secretPath, ephemeralSecret);
  } catch (e) {
    console.error('Failed to save ephemeral secret:', e);
  }
  
  return ephemeralSecret;
}

export const JWT_SECRET = getJwtSecret();

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (req.user.role !== role) {
      res.status(403).json({ error: 'Forbidden: Insufficient role' });
      return;
    }
    next();
  };
};
