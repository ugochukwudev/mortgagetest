import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';
import { AuthService } from '../services/auth.service.js';

export const validateSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);

    const session = await AuthService.validateSession(token);

    if (!session) {
      res.status(401).json({ error: 'Invalid or expired session' });
      return;
    }

    req.user = session;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Session validation failed' });
    return;
  }
};

