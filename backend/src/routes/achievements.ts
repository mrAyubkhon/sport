import { Router } from 'express';
import {
  createAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
  getAchievementStats,
  getFriendsAchievements,
} from '../controllers/achievementController';
import { authenticate } from '../middleware/auth';
import {
  validateBody,
  validateQuery,
  validateParams,
  createAchievementSchema,
  updateAchievementSchema,
  paginationSchema,
} from '../utils/validation';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Achievement CRUD routes
router.post('/', validateBody(createAchievementSchema), createAchievement);
router.get('/', validateQuery(paginationSchema), getAchievements);
router.get('/stats', getAchievementStats);
router.get('/friends', validateQuery(paginationSchema), getFriendsAchievements);
router.get('/:id', validateParams(z.object({ id: z.string().cuid() })), getAchievementById);
router.put('/:id', validateParams(z.object({ id: z.string().cuid() })), validateBody(updateAchievementSchema), updateAchievement);
router.delete('/:id', validateParams(z.object({ id: z.string().cuid() })), deleteAchievement);

export default router;
