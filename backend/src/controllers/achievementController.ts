import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { CreateAchievementData, UpdateAchievementData, AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const createAchievement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const achievementData: CreateAchievementData = req.body;

  // Validate custom activity name
  if (achievementData.type === 'custom' && !achievementData.name) {
    throw createError('Name is required for custom activities', 400);
  }

  const achievement = await prisma.achievement.create({
    data: {
      ...achievementData,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  // Send notification to friends about new achievement
  const friends = await prisma.friendship.findMany({
    where: {
      OR: [
        { user1Id: userId },
        { user2Id: userId },
      ],
    },
    include: {
      user1: { select: { id: true } },
      user2: { select: { id: true } },
    },
  });

  const friendIds = friends.map(friendship => 
    friendship.user1Id === userId ? friendship.user2.id : friendship.user1.id
  );

  if (friendIds.length > 0) {
    await prisma.notification.createMany({
      data: friendIds.map(friendId => ({
        userId: friendId,
        type: 'NEW_ACHIEVEMENT',
        title: 'New Achievement!',
        message: `${req.user!.name} just completed a ${achievementData.type} activity!`,
        data: JSON.stringify({
          achievementId: achievement.id,
          friendId: userId,
          friendName: req.user!.name,
        }),
      })),
    });
  }

  sendSuccess(res, achievement, 'Achievement created successfully', 201);
});

export const getAchievements = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { page = 1, limit = 10, type, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = { userId };
  if (type && type !== 'all') {
    where.type = type;
  }

  const [achievements, total] = await Promise.all([
    prisma.achievement.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy as string]: sortOrder },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.achievement.count({ where }),
  ]);

  sendPaginatedSuccess(res, achievements, {
    page: Number(page),
    limit: Number(limit),
    total,
  }, 'Achievements retrieved successfully');
});

export const getAchievementById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const achievement = await prisma.achievement.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  if (!achievement) {
    throw createError('Achievement not found', 404);
  }

  sendSuccess(res, achievement, 'Achievement retrieved successfully');
});

export const updateAchievement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const updateData: UpdateAchievementData = req.body;

  // Check if achievement exists and belongs to user
  const existingAchievement = await prisma.achievement.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingAchievement) {
    throw createError('Achievement not found', 404);
  }

  const achievement = await prisma.achievement.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  sendSuccess(res, achievement, 'Achievement updated successfully');
});

export const deleteAchievement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  // Check if achievement exists and belongs to user
  const existingAchievement = await prisma.achievement.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingAchievement) {
    throw createError('Achievement not found', 404);
  }

  await prisma.achievement.delete({
    where: { id },
  });

  sendSuccess(res, null, 'Achievement deleted successfully');
});

export const getAchievementStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

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

  const totalStats = await prisma.achievement.aggregate({
    where: { userId },
    _sum: {
      value: true,
      duration: true,
    },
    _count: {
      id: true,
    },
  });

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

  sendSuccess(res, {
    byType: stats,
    total: totalStats,
    recent: recentAchievements,
  }, 'Achievement statistics retrieved successfully');
});

export const getFriendsAchievements = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

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

  if (friendIds.length === 0) {
    sendPaginatedSuccess(res, [], {
      page: Number(page),
      limit: Number(limit),
      total: 0,
    }, 'No friends found');
    return;
  }

  const [achievements, total] = await Promise.all([
    prisma.achievement.findMany({
      where: {
        userId: {
          in: friendIds,
        },
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.achievement.count({
      where: {
        userId: {
          in: friendIds,
        },
      },
    }),
  ]);

  sendPaginatedSuccess(res, achievements, {
    page: Number(page),
    limit: Number(limit),
    total,
  }, 'Friends achievements retrieved successfully');
});
