import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { UserService } from '../services/user.service.js';
import { updateUserSchema, searchUsersSchema } from '../utils/validation.util.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

export class UserController {
  static async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await UserService.getUserById(id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({ user });
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { id } = req.params;

      if (req.user.userId !== id) {
        throw new AppError('You can only update your own profile', 403);
      }

      const validated = updateUserSchema.parse(req.body);

      const user = await UserService.updateUser(id, validated);

      res.json({
        message: 'User updated successfully',
        user,
      });
    } catch (error) {
      throw error;
    }
  }

  static async searchUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validated = searchUsersSchema.parse(req.query);

      const result = await UserService.searchUsers(
        validated.q || '',
        validated.page,
        validated.limit,
        req.user?.userId
      );

      res.json(result);
    } catch (error) {
      throw error;
    }
  }
}

