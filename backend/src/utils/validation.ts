import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1).max(150).optional(),
  weight: z.number().min(1).max(500).optional(),
  height: z.number().min(50).max(300).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  age: z.number().min(1).max(150).optional(),
  weight: z.number().min(1).max(500).optional(),
  height: z.number().min(50).max(300).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Achievement validation schemas
export const createAchievementSchema = z.object({
  type: z.enum(['running', 'swimming', 'cycling', 'custom']),
  name: z.string().min(1, 'Name is required for custom activities').optional(),
  value: z.number().positive('Value must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  duration: z.number().positive('Duration must be positive').optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

export const updateAchievementSchema = createAchievementSchema.partial();

// Friend validation schemas
export const sendFriendRequestSchema = z.object({
  receiverEmail: z.string().email('Invalid email address'),
});

export const friendRequestResponseSchema = z.object({
  requestId: z.string().cuid('Invalid request ID'),
  action: z.enum(['accept', 'reject']),
});

// Notification validation schemas
export const markNotificationReadSchema = z.object({
  notificationId: z.string().cuid('Invalid notification ID'),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Generic validation middleware
export const validateBody = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};
