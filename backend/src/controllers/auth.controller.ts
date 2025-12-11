import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { AuthService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../utils/validation.util.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { generateToken } from '../utils/jwt.util.js';
import prisma from '../config/database.js';
import env from '../config/env.js';

export class AuthController {
  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);

      const user = await AuthService.register(
        validated.email,
        validated.password,
        validated.name
      );

      const token = generateToken({ userId: user.id, email: user.email });
      
      const expiresInMatch = env.JWT_EXPIRES_IN.match(/^(\d+)([dhms])$/);
      const expiresAt = new Date();
      if (expiresInMatch) {
        const value = parseInt(expiresInMatch[1]);
        const unit = expiresInMatch[2];
        if (unit === 'd') {
          expiresAt.setDate(expiresAt.getDate() + value);
        } else if (unit === 'h') {
          expiresAt.setHours(expiresAt.getHours() + value);
        } else if (unit === 'm') {
          expiresAt.setMinutes(expiresAt.getMinutes() + value);
        } else {
          expiresAt.setSeconds(expiresAt.getSeconds() + value);
        }
      } else {
        expiresAt.setDate(expiresAt.getDate() + 7);
      }

      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token,
      });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        throw new AppError(error.message, 409);
      }
      throw error;
    }
  }

  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);

      const result = await AuthService.login(validated.email, validated.password);

      res.json({
        message: 'Login successful',
        ...result,
      });
    } catch (error: any) {
      if (error.message.includes('Invalid')) {
        throw new AppError(error.message, 401);
      }
      throw error;
    }
  }

  static async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        await AuthService.logout(token);
      }

      res.json({ message: 'Logout successful' });
    } catch (error) {
      throw error;
    }
  }

  static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await AuthService.getCurrentUser(req.user.userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({ user });
    } catch (error) {
      throw error;
    }
  }
}

