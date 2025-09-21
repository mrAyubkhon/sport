import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { UpdateUserData, AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      age: true,
      weight: true,
      height: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  sendSuccess(res, user, 'Profile retrieved successfully');
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const updateData: UpdateUserData = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      age: true,
      weight: true,
      height: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  sendSuccess(res, user, 'Profile updated successfully');
});

export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      age: true,
      createdAt: true,
      _count: {
        select: {
          achievements: true,
        },
      },
    },
  });

  if (!user) {
    throw createError('User not found', 404);
  }

  // Check if current user is friends with this user
  const currentUserId = req.user!.id;
  let friendshipStatus = 'none';

  if (currentUserId !== userId) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: userId },
          { user1Id: userId, user2Id: currentUserId },
        ],
      },
    });

    if (friendship) {
      friendshipStatus = 'friends';
    } else {
      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: userId },
            { senderId: userId, receiverId: currentUserId },
          ],
        },
      });

      if (friendRequest) {
        friendshipStatus = friendRequest.status.toLowerCase();
      }
    }
  }

  // Get recent achievements
  const recentAchievements = await prisma.achievement.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      type: true,
      value: true,
      unit: true,
      duration: true,
      createdAt: true,
    },
  });

  // Get achievement stats
  const stats = await prisma.achievement.groupBy({
    by: ['type'],
    where: { userId },
    _sum: {
      value: true,
      duration: true,
    },
    _count: {
      id: true,
    },
  });

  sendSuccess(res, {
    ...user,
    friendshipStatus,
    recentAchievements,
    achievementStats: stats,
  }, 'User profile retrieved successfully');
});

export const getLeaderboard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { type = 'all', period = 'month' } = req.query;
  const userId = req.user!.id;

  // Calculate date range based on period
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  // Get user's friends
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { user1Id: userId },
        { user2Id: userId },
      ],
    },
    include: {
      user1: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      user2: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const friendIds = friendships.map(friendship => 
    friendship.user1Id === userId ? friendship.user2.id : friendship.user1.id
  );

  // Include current user in leaderboard
  const allUserIds = [userId, ...friendIds];

  // Build where clause for achievements
  const whereClause: any = {
    userId: { in: allUserIds },
    createdAt: { gte: startDate },
  };

  if (type !== 'all') {
    whereClause.type = type;
  }

  // Get leaderboard data
  const leaderboardData = await prisma.achievement.groupBy({
    by: ['userId'],
    where: whereClause,
    _sum: {
      value: true,
      duration: true,
    },
    _count: {
      id: true,
    },
  });

  // Get user details for leaderboard
  const users = await prisma.user.findMany({
    where: {
      id: { in: allUserIds },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  });

  // Combine data and sort by total value
  const leaderboard = leaderboardData
    .map(item => {
      const user = users.find(u => u.id === item.userId);
      return {
        user,
        totalValue: item._sum.value || 0,
        totalDuration: item._sum.duration || 0,
        activityCount: item._count.id,
        isCurrentUser: item.userId === userId,
      };
    })
    .filter(item => item.user) // Filter out users that might not exist
    .sort((a, b) => b.totalValue - a.totalValue);

  sendSuccess(res, {
    leaderboard,
    period,
    type,
    userRank: leaderboard.findIndex(item => item.isCurrentUser) + 1,
  }, 'Leaderboard retrieved successfully');
});

export const deleteAccount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { password } = req.body;

  // Verify password
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user) {
    throw createError('User not found', 404);
  }

  const bcrypt = require('bcryptjs');
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw createError('Invalid password', 401);
  }

  // Delete user (cascade will handle related records)
  await prisma.user.delete({
    where: { id: userId },
  });

  sendSuccess(res, null, 'Account deleted successfully');
});
