import { Router } from 'express';
import {
  searchUsers,
  sendFriendRequest,
  respondToFriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend,
} from '../controllers/friendController';
import { authenticate } from '../middleware/auth';
import {
  validateBody,
  validateQuery,
  validateParams,
  sendFriendRequestSchema,
  friendRequestResponseSchema,
  paginationSchema,
} from '../utils/validation';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User search and friend management
router.get('/search', validateQuery(paginationSchema), searchUsers);
router.post('/request', validateBody(sendFriendRequestSchema), sendFriendRequest);
router.post('/request/respond', validateBody(friendRequestResponseSchema), respondToFriendRequest);
router.get('/requests', validateQuery(paginationSchema), getFriendRequests);
router.get('/', validateQuery(paginationSchema), getFriends);
router.delete('/:friendId', validateParams(z.object({ friendId: z.string().cuid() })), removeFriend);

export default router;
