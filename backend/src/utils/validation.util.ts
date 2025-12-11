import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
});

export const relationshipRequestSchema = z.object({
  addresseeId: z.string().uuid('Invalid user ID'),
});

export const updateRelationshipSchema = z.object({
  status: z.enum(['ACCEPTED', 'BLOCKED'], {
    errorMap: () => ({ message: 'Status must be ACCEPTED or BLOCKED' }),
  }),
});

export const searchUsersSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

