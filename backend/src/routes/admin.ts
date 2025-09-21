import { Router } from 'express';
import { requireAdmin } from '../middleware/adminAuth';
import { authenticate } from '../middleware/auth';
import {
  getAllUsers,
  getUserById,
  getAllAchievements,
  getStatistics,
  deleteUser,
  updateUserRole
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);

// Achievement management
router.get('/achievements', getAllAchievements);

// Statistics
router.get('/statistics', getStatistics);

export default router;
