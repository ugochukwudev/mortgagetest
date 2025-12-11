import prisma from '../config/database.js';
import { CacheService } from './cache.service.js';

export class UserService {
  static async getUserById(userId: string, excludePassword: boolean = true) {
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

  static async updateUser(userId: string, data: { name?: string; bio?: string | null; avatar?: string | null }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
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

    await CacheService.invalidateUserProfile(userId);

    return user;
  }

  static async searchUsers(query: string, page: number = 1, limit: number = 20, excludeUserId?: string) {
    const skip = (page - 1) * limit;

    const where = excludeUserId
      ? {
          AND: [
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { email: { contains: query, mode: 'insensitive' as const } },
              ],
            },
            { id: { not: excludeUserId } },
          ],
        }
      : {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { email: { contains: query, mode: 'insensitive' as const } },
          ],
        };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: query ? where : excludeUserId ? { id: { not: excludeUserId } } : {},
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({
        where: query ? where : excludeUserId ? { id: { not: excludeUserId } } : {},
      }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

