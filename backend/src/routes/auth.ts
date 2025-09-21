import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import {
  validateBody,
  createUserSchema,
  loginSchema,
} from '../utils/validation';

const router = Router();

// Public routes
router.post('/register', validateBody(createUserSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refreshToken);

// Protected routes
router.use(authenticate);
router.post('/logout', logout);
router.get('/profile', getProfile);

export default router;
