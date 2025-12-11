import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateSession } from '../middleware/session.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';

const router = Router();

router.get('/:id', authenticate, validateSession, asyncHandler(UserController.getUserById.bind(UserController)));
router.put('/:id', authenticate, validateSession, asyncHandler(UserController.updateUser.bind(UserController)));
router.get('/', authenticate, validateSession, asyncHandler(UserController.searchUsers.bind(UserController)));

export default router;

