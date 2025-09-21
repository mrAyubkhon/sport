import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUserProfile,
  getLeaderboard,
  deleteAccount,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import {
  validateBody,
  validateQuery,
  validateParams,
  updateUserSchema,
  paginationSchema,
} from '../utils/validation';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User profile and leaderboard
router.get('/profile', getProfile);
router.put('/profile', validateBody(updateUserSchema), updateProfile);
router.get('/leaderboard', validateQuery(paginationSchema), getLeaderboard);
router.delete('/account', validateBody(z.object({ password: z.string() })), deleteAccount);
router.get('/:userId', validateParams(z.object({ userId: z.string().cuid() })), getUserProfile);

export default router;
