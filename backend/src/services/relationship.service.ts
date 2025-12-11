import prisma from '../config/database.js';
import { CacheService } from './cache.service.js';
import { RelationshipStatus } from '@prisma/client';

export class RelationshipService {
  static async sendFriendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new Error('Cannot send friend request to yourself');
    }

    const existingRelationship = await prisma.relationship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });

    if (existingRelationship) {
      throw new Error('Relationship already exists');
    }

    const relationship = await prisma.relationship.create({
      data: {
        requesterId,
        addresseeId,
        status: RelationshipStatus.PENDING,
      },
      include: {
        requester: {
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
        addressee: {
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
      },
    });

    await CacheService.invalidateBothUsersRelationships(requesterId, addresseeId);

    return relationship;
  }

  static async getUserRelationships(userId: string) {
    const cached = await CacheService.getUserRelationships(userId);
    if (cached) {
      return cached;
    }

    const relationships = await prisma.relationship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: {
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
        addressee: {
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    await CacheService.setUserRelationships(userId, relationships);

    return relationships;
  }

  static async updateRelationship(
    relationshipId: string,
    userId: string,
    status: RelationshipStatus
  ) {
    const relationship = await prisma.relationship.findUnique({
      where: { id: relationshipId },
    });

    if (!relationship) {
      throw new Error('Relationship not found');
    }

    if (relationship.addresseeId !== userId) {
      throw new Error('Only the addressee can accept or reject the request');
    }

    if (relationship.status !== RelationshipStatus.PENDING) {
      throw new Error('Relationship is not pending');
    }

    const updated = await prisma.relationship.update({
      where: { id: relationshipId },
      data: { status },
      include: {
        requester: {
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
        addressee: {
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
      },
    });

    await CacheService.invalidateBothUsersRelationships(
      relationship.requesterId,
      relationship.addresseeId
    );

    return updated;
  }

  static async removeRelationship(relationshipId: string, userId: string) {
    const relationship = await prisma.relationship.findUnique({
      where: { id: relationshipId },
    });

    if (!relationship) {
      throw new Error('Relationship not found');
    }

    if (relationship.requesterId !== userId && relationship.addresseeId !== userId) {
      throw new Error('You can only remove your own relationships');
    }

    await prisma.relationship.delete({
      where: { id: relationshipId },
    });

    await CacheService.invalidateBothUsersRelationships(
      relationship.requesterId,
      relationship.addresseeId
    );

    return { message: 'Relationship removed successfully' };
  }
}

