import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { RelationshipService } from '../services/relationship.service.js';
import { relationshipRequestSchema, updateRelationshipSchema } from '../utils/validation.util.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { RelationshipStatus } from '@prisma/client';

export class RelationshipController {
  static async sendFriendRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const validated = relationshipRequestSchema.parse(req.body);

      const relationship = await RelationshipService.sendFriendRequest(
        req.user.userId,
        validated.addresseeId
      );

      res.status(201).json({
        message: 'Friend request sent successfully',
        relationship,
      });
    } catch (error: any) {
      if (error.message.includes('already exists') || error.message.includes('yourself')) {
        throw new AppError(error.message, 400);
      }
      throw error;
    }
  }

  static async getUserRelationships(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const relationships = await RelationshipService.getUserRelationships(req.user.userId);

      res.json({ relationships });
    } catch (error) {
      throw error;
    }
  }

  static async updateRelationship(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { id } = req.params;
      const validated = updateRelationshipSchema.parse(req.body);

      const relationship = await RelationshipService.updateRelationship(
        id,
        req.user.userId,
        validated.status as RelationshipStatus
      );

      res.json({
        message: 'Relationship updated successfully',
        relationship,
      });
    } catch (error: any) {
      if (error.message.includes('not found') || error.message.includes('not pending')) {
        throw new AppError(error.message, 404);
      }
      if (error.message.includes('only the addressee')) {
        throw new AppError(error.message, 403);
      }
      throw error;
    }
  }

  static async removeRelationship(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { id } = req.params;

      const result = await RelationshipService.removeRelationship(id, req.user.userId);

      res.json(result);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        throw new AppError(error.message, 404);
      }
      if (error.message.includes('only remove')) {
        throw new AppError(error.message, 403);
      }
      throw error;
    }
  }
}

