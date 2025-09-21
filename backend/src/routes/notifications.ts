import { Router } from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationStats,
} from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';
import {
  validateQuery,
  validateParams,
  paginationSchema,
  markNotificationReadSchema,
} from '../utils/validation';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Notification management
router.get('/', validateQuery(paginationSchema), getNotifications);
router.get('/stats', getNotificationStats);
router.patch('/:notificationId/read', validateParams(markNotificationReadSchema), markNotificationAsRead);
router.patch('/read-all', markAllNotificationsAsRead);
router.delete('/:notificationId', validateParams(z.object({ notificationId: z.string().cuid() })), deleteNotification);

export default router;
