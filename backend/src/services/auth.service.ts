import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken, verifyToken, JWTPayload } from '../utils/jwt.util.js';
import { CacheService } from './cache.service.js';
import env from '../config/env.js';

export class AuthService {
  static async register(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Invalidate all previous sessions
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    await CacheService.invalidateUserSessions(user.id);

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

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    await CacheService.setSession(token, {
      userId: user.id,
      email: user.email,
      sessionId: session.id,
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: userData,
      token,
    };
  }

  static async logout(token: string) {
    const decoded = verifyToken(token);

    await prisma.session.deleteMany({
      where: {
        userId: decoded.userId,
        token,
      },
    });

    await CacheService.invalidateSession(token);
  }

  static async validateSession(token: string): Promise<JWTPayload | null> {
    try {
      const cached = await CacheService.getSession(token);
      if (cached) {
        return { userId: cached.userId, email: cached.email };
      }

      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      await CacheService.setSession(token, {
        userId: session.userId,
        email: session.user.email,
        sessionId: session.id,
      });

      return {
        userId: session.userId,
        email: session.user.email,
      };
    } catch (error) {
      return null;
    }
  }

  static async getCurrentUser(userId: string) {
    const cached = await CacheService.getUserProfile(userId);
    if (cached) {
      return cached;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (user) {
      await CacheService.setUserProfile(userId, user);
    }

    return user;
  }
}

