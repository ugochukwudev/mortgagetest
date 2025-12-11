import redis from '../config/redis.js';
import logger from '../utils/logger.util.js';

const CACHE_TTL = {
  USER_PROFILE: 5 * 60, // 5 minutes
  RELATIONSHIPS: 2 * 60, // 2 minutes
  SESSION: 60 * 60, // 1 hour
};

export class CacheService {
  // User profile caching
  static async getUserProfile(userId: string): Promise<any | null> {
    try {
      const cached = await redis.get(`user:${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  static async setUserProfile(userId: string, userData: any): Promise<void> {
    try {
      await redis.setex(`user:${userId}`, CACHE_TTL.USER_PROFILE, JSON.stringify(userData));
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  static async invalidateUserProfile(userId: string): Promise<void> {
    try {
      await redis.del(`user:${userId}`);
    } catch (error) {
      logger.error('Cache invalidation error:', error);
    }
  }

  // Relationships caching
  static async getUserRelationships(userId: string): Promise<any[] | null> {
    try {
      const cached = await redis.get(`relationships:${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  static async setUserRelationships(userId: string, relationships: any[]): Promise<void> {
    try {
      await redis.setex(`relationships:${userId}`, CACHE_TTL.RELATIONSHIPS, JSON.stringify(relationships));
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  static async invalidateUserRelationships(userId: string): Promise<void> {
    try {
      await redis.del(`relationships:${userId}`);
    } catch (error) {
      logger.error('Cache invalidation error:', error);
    }
  }

  static async invalidateBothUsersRelationships(userId1: string, userId2: string): Promise<void> {
    try {
      await redis.del(`relationships:${userId1}`, `relationships:${userId2}`);
    } catch (error) {
      logger.error('Cache invalidation error:', error);
    }
  }

  // Session caching
  static async getSession(token: string): Promise<any | null> {
    try {
      const cached = await redis.get(`session:${token}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  static async setSession(token: string, sessionData: any): Promise<void> {
    try {
      await redis.setex(`session:${token}`, CACHE_TTL.SESSION, JSON.stringify(sessionData));
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  static async invalidateSession(token: string): Promise<void> {
    try {
      await redis.del(`session:${token}`);
    } catch (error) {
      logger.error('Cache invalidation error:', error);
    }
  }

  static async invalidateUserSessions(userId: string): Promise<void> {
    try {
      const keys = await redis.keys(`session:*`);
      for (const key of keys) {
        const sessionData = await redis.get(key);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.userId === userId) {
            await redis.del(key);
          }
        }
      }
    } catch (error) {
      logger.error('Cache invalidation error:', error);
    }
  }
}

