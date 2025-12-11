import { Router } from 'express';
import { RelationshipController } from '../controllers/relationship.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateSession } from '../middleware/session.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';

const router = Router();

router.post('/request', authenticate, validateSession, asyncHandler(RelationshipController.sendFriendRequest.bind(RelationshipController)));
router.get('/', authenticate, validateSession, asyncHandler(RelationshipController.getUserRelationships.bind(RelationshipController)));
router.put('/:id', authenticate, validateSession, asyncHandler(RelationshipController.updateRelationship.bind(RelationshipController)));
router.delete('/:id', authenticate, validateSession, asyncHandler(RelationshipController.removeRelationship.bind(RelationshipController)));

export default router;

