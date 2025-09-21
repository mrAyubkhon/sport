import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        age: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            achievements: true,
            notifications: true,
            friendships1: true,
            friendships2: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);

  sendSuccess(res, {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }, 'Users retrieved successfully');
});

// Get user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      achievements: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      notifications: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  sendSuccess(res, user, 'User retrieved successfully');
});

// Get all achievements
export const getAllAchievements = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [achievements, total] = await Promise.all([
    prisma.achievement.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.achievement.count()
  ]);

  sendSuccess(res, {
    achievements,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }, 'Achievements retrieved successfully');
});

// Get statistics
export const getStatistics = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalUsers,
    totalAdmins,
    totalAchievements,
    totalFriendships,
    totalNotifications,
    recentUsers,
    recentAchievements
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.achievement.count(),
    prisma.friendship.count(),
    prisma.notification.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    }),
    prisma.achievement.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    })
  ]);

  const achievementsByType = await prisma.achievement.groupBy({
    by: ['type'],
    _count: {
      type: true
    }
  });

  sendSuccess(res, {
    totalUsers,
    totalAdmins,
    totalAchievements,
    totalFriendships,
    totalNotifications,
    recentUsers,
    recentAchievements,
    achievementsByType
  }, 'Statistics retrieved successfully');
});

// Delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (id === req.user!.userId) {
    return sendError(res, 'Cannot delete your own account', 400);
  }

  await prisma.user.delete({
    where: { id }
  });

  sendSuccess(res, null, 'User deleted successfully');
});

// Update user role
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['USER', 'ADMIN'].includes(role)) {
    return sendError(res, 'Invalid role. Must be USER or ADMIN', 400);
  }

  // Prevent admin from changing their own role
  if (id === req.user!.userId) {
    return sendError(res, 'Cannot change your own role', 400);
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      updatedAt: true
    }
  });

  sendSuccess(res, user, 'User role updated successfully');
});
